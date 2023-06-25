'use strict';

const Homey = require('homey');
const Gateway = require('../../lib/gateways/eagle200/gateway');
const Device = require('../../lib/gateways/eagle200/device');
const Logger = require('../../lib/logger');
const {resolve} = require('path');

class eagle200Device extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {

        this.logger = new Logger('trace', 'device:' + this.getName());
        this.logger.setDebug(this.homey.app.debug);
        this.logger.trace();

        // Gather the required data ofr the device.
        this.data = this.getData();
        this.settings = this.getSettings();
        this.store = this.getStore();
        this.isAuthorized = false;

        await this.init();
        this.initPolls();
    }

    /**
     * Normally you would return a truthy result, if the discovery.id is the same as the device.id
     *
     * Very edgecase this will ensure if there are two eagles on the network the one found is the right one.
     *
     * @param {*} discoveryResult
     * @returns
     */
    onDiscoveryResult(discoveryResult) {
        this.logger.trace();
        return this.store.gateway.lanMac = discoveryResult.mac
    }

    /**
     * This method will be executed once when the device has been found (onDiscoveryResult returned true)
     */
    async onDiscoveryAvailable(discoveryResult) {
        this.logger.trace();
        this.init();
    }

    onDiscoveryAddressChanged(discoveryResult) {
        this.logger.trace(discoveryResult.address);
        this.setSettings({ipAddress: discoveryResult.address});
        this.init();
    }

    onDiscoveryLastSeenChanged(discoveryResult) {
        this.log('onDiscoveryLastSeenChanged', discoveryResult.address);
        // When the device is offline, try to reconnect here
        // this.api.reconnect().catch(this.error);
    }

    async init() {
        this.logger.trace(this.settings);
        this.initObjects();

        this.isAuthorized = await this.gateway.isAuthorized;
        if (this.isAuthorized) {
            this.setAvailable();
            this.measurePower();
            this.meterPower();
        } else {
            this.setUnavailable();
        }
    }

    /**
     * Initialise the objects required by the device.
     */
    initObjects() {
        this.logger.trace();
        this.gateway = new Gateway(this.settings.ipAddress, this.store.gateway);
        this.device = new Device(this.data.id, this.gateway);
    }

    /**
     * Add Polls to the device, ensuring values are updated.
     */
    initPolls() {
        this.logger.trace();
        this.homey.setInterval(() => {
            this.meterPower();
        }, 1000 * 60 * this.settings.meterPollingFrequency);
        this.homey.setInterval(() => {
            this.measurePower();
        }, 1000 * this.settings.measurePollingFrequency);
    }

    /**
     * onSettings is called when the user updates the device's settings.
     * @param {object} event the onSettings event data
     * @param {object} event.oldSettings The old settings object
     * @param {object} event.newSettings The new settings object
     * @param {string[]} event.changedKeys An array of keys changed since the previous version
     * @returns {Promise<string|void>} return a custom message that will be displayed
     */
    async onSettings({oldSettings, newSettings, changedKeys}) {
        this.logger.trace();
        this.settings = newSettings;
        this.init();
    }

    /**
     * Current Power Consumption.
     *
     * @todo create new data structure for kW as it is currently being stored as a Watt
     */
    async measurePower() {
        this.logger.trace();
        if (this.isAuthorized) {
            this.setCapabilityValue('measure_power', ((await this.device.InstantaneousDemand).Value) * 1000).catch(this.error);
        }
    }


    /**
     * Total amount of power consumed.
     *
     * @todo create new data structure for mW as it is currently being stored as a kW
     * @todo allow user to choose whether they require delivered/received/(delivered-received)
     *
     * @returns {*}
     */
    async meterPower() {
        this.logger.trace();
        if (this.isAuthorized) {
            this.setCapabilityValue('meter_power', ((await this.device.CurrentSummationDelivered).Value) * 1).catch(this.error);
        }
    }
}

module.exports = eagle200Device;
