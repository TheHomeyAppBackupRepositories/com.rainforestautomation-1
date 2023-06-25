'use strict';

const Homey = require('homey');
const Gateway = require('../../lib/gateways/eagle200/gateway');
const Logger = require('../../lib/logger');

/**
 * Map of capabilities which to override (app.json) with, if required.
 *
 * @type {{"generic:electric_meter": string[]}}
 */
const typeCapabilityMap = {
    'generic:electric_meter': ['meter_power', 'measure_power'],
};

/**
 * Map of icons to override (app.json) with, if required.
 * @type {{"generic:electric_meter": string}}
 */
const iconsMap = {
    'generic:electric_meter': 'generic-electric_meter',
};

class eagle200Driver extends Homey.Driver {

    async onInit() {
        this.logger = new Logger('trace', 'driver:' + this.manifest.id);
        this.logger.setDebug(this.homey.app.debug);
        this.logger.trace();
    }

    async onPair(session) {
        this.logger.trace();

        let gatewayDetails = await this.discoverGateway();

        this.ipAddress = gatewayDetails.ipAddress;
        this.config = {
            lanMac: gatewayDetails.lanMac
        };

        session.setHandler("get_ip-address", async () => {
            this.logger.trace('get_ip-address');
            return this.ipAddress
        });
        session.setHandler("save_settings", async (data) => {
            this.logger.trace('save_settings');
            return this.onSaveSettings(data)
        });
        session.setHandler("list_devices", async (data) => {
            this.logger.trace('list_devices');
            return this.onListDevices(data)
        });
    }

    async onSaveSettings(data) {
        this.logger.trace();
        this.ipAddress = data.ipAddress;
        delete data.ipAddress;

        Object.assign(this.config, data);

        // Attempt to connect to the gateway, before proceeding.
        this.gateway = await new Gateway(this.ipAddress, this.config);
        return await this.gateway.isAuthorized;
    }

    async onListDevices(data) {
        this.logger.trace();
        let result = [];

        // Get a list of all devices attached to the gateway
        let devices = await this.gateway.DeviceList;
        // If everything succeeded, and we have at-least one device
        if (devices.length) {

            // Loop through all of the devices adding them to our result.
            for (let i in devices) {

                // Clean up the device and return the device object we need to add.
                let device = await this.buildDeviceObject(devices[i]);

                // Add the device we have built to the end of the result array.
                result.push(device);
            }
        }
        return result;
    }

    /**
     * Build a Homey device from the gateway device we receive.
     *
     * @todo test whether the NIC address will change based upon wifi/ethernet.
     * @todo try/catch
     * @param deviceSummary object
     * @returns {PromiseLike<{name: *, settings: {ipAddress: string, meterPollingFrequency: number, measurePollingFrequency: number}, data: {hardwareAddress: string, gateway: {cloudId: boolean, macAddress: boolean, installCode: boolean}}, store: {networkInterface: *, connectionStatus: *, lastContact: *, variables: {initial: Array, current: Array}}} | never> | Promise<{name: *, settings: {ipAddress: string, meterPollingFrequency: number, measurePollingFrequency: number}, data: {hardwareAddress: string, gateway: {cloudId: boolean, macAddress: boolean, installCode: boolean}}, store: {networkInterface: *, connectionStatus: *, lastContact: *, variables: {initial: Array, current: Array}}} | never>}
     */
    async buildDeviceObject(deviceSummary) {
        this.logger.trace();
        // Set out gateway objects device to the current device we are building.
        this.gateway.Device = deviceSummary.HardwareAddress;

        // Transform the data into an athom device.
        let device = this.gateway.device.getDetails().then((response) => {
            let deviceObj = {
                name: response.DeviceDetails.Name,
                settings: {
                    ipAddress: this.ipAddress,
                    meterPollingFrequency: 15,
                    measurePollingFrequency: 15,
                },
                data: {
                    id: response.DeviceDetails.HardwareAddress,
                },
                store: {
                    gateway: {
                        lanMac: this.config.lanMac,
                        cloudId: this.config.cloudId,
                        macAddress: this.config.macAddress,
                        installCode: this.config.installCode,
                    },
                    device: {
                        connectionStatus: deviceSummary.ConnectionStatus,
                        lastContact: deviceSummary.LastContact,
                        variables: {
                            initial: response.Components.Component.Variables,
                            current: response.Components.Component.Variables
                        }
                    }
                }
            };

            // Get a unique value to check our maps against for distinct values
            let deviceType = response.DeviceDetails.Manufacturer.toLowerCase() + ':' + response.DeviceDetails.ModelId.toLowerCase();

            // If we have a specific icon assigned for this device - add it.
            if (typeof iconsMap[deviceType] === 'string') {
                deviceObj.icon = `/icons/${iconsMap[deviceType]}.svg`;
            }

            // If we have a specific capabilities assigned for this device - add them.
            if (typeof typeCapabilityMap[deviceType] === 'object') {
                deviceObj.capabilities = typeCapabilityMap[deviceType];
            }

            // Presto : the completed device, to be listed.
            return deviceObj;

        });

        return device;
    }

    /**
     * Using a mac address to discover the gateway device on the local network
     * Note that for simplicity it will only discover a single gateway.
     * 
     * Temp Checks have been added to this as the discovery is no longer working.
     * @todo Update and get discovery working again.
     *
     * @returns device
     */
    async discoverGateway() {
        this.logger.trace();
        const discoveryStrategy = await this.getDiscoveryStrategy();
        const discoveryResults = await discoveryStrategy.getDiscoveryResults();

        try {
            let result = {
                ipAddress: '',
                lanMac: ''
            };

            // @todo fix this mess and just return the IP.
            if (discoveryResults.length) {
                result = Object.values(discoveryResults).map(discoveryResult => {
                    return {
                        ipAddress: discoveryResult.address,
                        lanMac: discoveryResult.mac
                    }
                })[0];
            } else {
                this.logger.trace('out')
            }

            return result;
        } catch (e) {
            this.error(e);
        }

    }
}

module.exports = eagle200Driver;
