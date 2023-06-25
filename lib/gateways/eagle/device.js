'use strict';

const Command = require('./command');

/**
 * Allows access to the device, will gather device specific commands and parse the
 * request/response (via the eagle200 gateway class).
 *
 * @author Jamie Peake
 * @since 1.1.0.0
 * @date 2018-09-08 : Create from eagle-200 class.
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
    get InstantaneousDemand() { return this.getInstantaneousDemand(); }
    get CurrentSummation() { return this.getCurrentSummation(); }
    get CurrentSummationDelivered() { return this.getCurrentSummationDelivered(); }
    get CurrentSummationReceived() { return this.getCurrentSummationReceived(); }

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


        this.gateway.convertDate(result, 'TimeStamp');
        this.gateway.convertHex(result, ['Demand']); // ,'Multiplier','Divisor', 'DigitsRight', 'DigitsLeft']); :: Might need these later?

        return {Value: result.Demand};

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
        let result = await this.get(this.command.CurrentSummation);

        // Sadie the cleaning Lady
        this.gateway.convertHex(result, ['SummationDelivered', 'SummationReceived', 'Multiplier','Divisor', 'DigitsRight', 'DigitsLeft']);

        return result;
    }


    async getCurrentSummationDelivered()
    {
        let result = await this.get(this.command.CurrentSummation);

        // Sadie the cleaning Lady
        this.gateway.convertHex(result, ['SummationDelivered']);//,'Multiplier','Divisor', 'DigitsRight', 'DigitsLeft']);

        return {Value : result.SummationDelivered};
    }


    async getCurrentSummationReceived()
    {
        let result = await this.get(this.command.CurrentSummation);

        // Sadie the cleaning Lady
        this.gateway.convertHex(result, ['SummationReceived']);//,'Multiplier','Divisor', 'DigitsRight', 'DigitsLeft']);

        return {Value: result.SummationReceived};
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

        //  Set the command objects hardwareAddress
        this.command.HardwareAddress = hardwareAddress;
    }

    /**
     * Calls the gateway get, then does checks upon.
     * @param command
     */
    async get(command) {
        let result = await this.gateway.get(command);

        console.log(result);

        // @todo check to errors returned here once we know the error synax
        // @todo add generic checks to fix fields data type.

        return result;
    }

}

module.exports = Device;


