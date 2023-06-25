'use strict';

const { ReadableStreamDefaultController } = require('stream/web');
const Command = require('./command');

/**
 * Allows access to the device, will gather device specific commands and parse the
 * request/response (via the eagle200 gateway class).
 *
 * @author Jamie Peake
 * @since 1.0.0.0-alpha2
 * @date 2018-08-30
 */
class Device {

    /**
     * Assign the hardwareAddress and gateway object
     *
     * @param hardwareAddress (devices hardware mac address).
     * @param gateway object
     */
    constructor(hardwareAddress, gateway) {
        // Create a new command object with our hardware address
        this.command = new Command(hardwareAddress);

        // Assign the gateway object, for access to requests/parsing
        this.gateway = gateway;
    }


    /*
     * Alias getters and setters to their respective function, where applicable.
     */
    get Details() { return this.getDetails(); }
    get All() { return this.getAll(); }
    get InstantaneousDemand() { return this.getInstantaneousDemand(); }
    get CurrentSummationDelivered() { return this.getCurrentSummationDelivered(); }
    get CurrentSummationReceived() { return this.getCurrentSummationReceived(); }
    get BillingPeriodStart() { return this.getBillingPeriodStart(); }

    /**
     * Getter to return the device hardwareAddress directly which is being used with in the command object.
     *
     * @returns {boolean|*}
     * @constructor
     */
    get Device() { return this.getDevice(); }


    /**
     * Setter, which will set the  device hardware address with in the command object.
     * @param hardwareAddress
     * @constructor
     */
    set Device(hardwareAddress) { return this.setDevice(hardwareAddress); }


    /**
     * Returns the command to retrieve the details of the current device
     *
     * @returns {string}
     * @constructor
     */
    getDetails() {
        return this.get(this.command.DeviceDetails);
    }

    /**
     * Alias to return ALL the values of a device.
     *
     * @returns {string}
     * @constructor
     */
    getAll() {
        return this.get(this.command.DeviceQueryAll);
    }

    /**
     * Returns the instantaneous demand of the device.
     *
     * Returns the current power demand of a device. Will convert dates
     *
     * @todo add try/catch
     *
     * @returns {Promise<string|command._commands.DeviceQuery.Command.DeviceDetails|{HardwareAddress}|command._commands.DeviceDetails|{Command}|command._commands.DeviceDetails.Command.DeviceDetails|*>}
     */
    async getInstantaneousDemand() {

        let result = await this.get(this.command.InstantaneousDemand);
        return result.Components.Component.Variables.Variable;

    }

    /**
     * Returns the billing start value, and adds a human readable version.
     *
     * @todo Testing required to ensure that the billing period uses the same formula as other dates.
     *
     * @since 2018-08-30
     * @returns {Promise<command.variables.InstantaneousDemand.Variable|{Name}|command.variables.CurrentSummationDelivered.Variable|command.variables.CurrentSummationReceived.Variable|command.variables.BillingPeriodStart.Variable|{Name: string}|*>}
     */
    async getBillingPeriodStart() {

        // Get the Billing start period
        let result = await this.get(this.command.BillingPeriodStart);

        // Alias the result to useful data
        result = result.Components.Component.Variables.Variable;

        // Convert the date
        let human = new Date(result.Value * 1000);

        result.Human = human.toLocaleString();

        // Return
        return result;
    }


    /**
     * Returns the total summation amount of the device.
     *
     * Note this is a proof of concept, and as such is not supported.
     *
     * Current Delivered - Current Received
     *
     * @todo Update the code to check to see if there is any amount received, otherwise forgo this call.
     * @todo add try/catch
     *
     * @since 2018-08-30
     * @returns {Promise<string|command._commands.DeviceQuery.Command.DeviceDetails|{HardwareAddress}|command._commands.DeviceDetails|{Command}|command._commands.DeviceDetails.Command.DeviceDetails|*>}
     */
    async getCurrentSummation()
    {
        let delivered = await this.get(this.command.CurrentSummationDelivered);

        delivered = delivered.Components.Component.Variables.Variable;

        let received = await this.gateway.get(this.command.CurrentSummationReceived);

        received = received.Components.Component.Variables.Variable;

        // I believe we still want this to be a positive value for a net loss - ie its amount CONSUMED.
        return delivered - received;

    }


    /**
     * Returns the total delivered amount of the device.
     *
     * Returns the total power delivered to the device.
     *
     * @todo add try/catch
     * @since 2018-08-30
     * @returns {Promise<string|command._commands.DeviceQuery.Command.DeviceDetails|{HardwareAddress}|command._commands.DeviceDetails|{Command}|command._commands.DeviceDetails.Command.DeviceDetails|*>}
     */
    async getCurrentSummationDelivered()
    {
        let result = await this.get(this.command.CurrentSummationDelivered);

        return result.Components.Component.Variables.Variable;
    }

    /**
     * Returns the total delivered amount of the received.
     *
     * I believe this is used for energy generation supplied back ot the grid, ie. Solar/Wind/Hydro.
     *
     * @returns {Promise<command.variables.InstantaneousDemand.Variable|{Name}|command.variables.CurrentSummationDelivered.Variable|command.variables.CurrentSummationReceived.Variable|command.variables.BillingPeriodStart.Variable|{Name: string}>}
     */
    async getCurrentSummationReceived()
    {
        let result = await this.gateway.get(this.command.CurrentSummationReceived);

        return result.Components.Component.Variables.Variable;

    }

    /**
     * Returns the hardwareAddress set with in the command object.
     *
     * @returns {boolean|*}
     */
    getDevice() {
        return this.command.HardwareAddress;
    }

    /**
     * Sets the hardwareAddress set with in the command object
     * @param hardwareAddress
     */
    setDevice(hardwareAddress) {

        // Reinitialise internal pointer
        this.hardwareAddress = hardwareAddress;

        //  Set the command objects hardwareaddress
        this.command.HardwareAddress = hardwareAddress;
    }

    /**
     * Query device to return a set of (supplied) variables.
     * @param variables
     * @returns {*}
     */
    query(variables = []) {
        return this.gateway.get(this.command.query(variables));
    }

    /**
     * Calls the gateway get, then does checks upon.
     * @param command
     */
    async get(command) {

        let result = await this.gateway.get(command);

        // Check to see if an error has occurred.
        if (result.Device.hasOwnProperty('Error')) {
            throw new Error(result.Device.Error.Text);
        }

        // Check the usual suspects, for formatting
        if (result.Device.hasOwnProperty('DeviceDetails')) {
            if (result.Device.DeviceDetails.hasOwnProperty('LastContact')) {
                this.gateway.convertDate(result.Device.DeviceDetails, 'LastContact');
            }
        }
        

        return result.Device;
    }

}

module.exports = Device;


