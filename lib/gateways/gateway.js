'use strict';

const Request = require('./request');
const Parse = require('./parse');

/**
 * Gateway class, used to access the Eagle200 gateway itself.
 *
 * All calls to a specific device upon the gateway should be done through the gateway.device,
 * once the devices hardwareAddress has been supplied. (setter/constructor)
 *
 * @author Jamie Peake
 * @since 1.0.0.0-alpha2
 * @date 2018-08-30
 */
class Gateway {

    constructor (ipAddress, settings, hardwareAddress = false, DeviceClass) {

        // Always going to require an IP address to contact the gateway.
        this.ipAddress = ipAddress;

        this.settings = settings;

        // Our request object which will make the http request.
        this.request = new Request(ipAddress, settings);

        // Our parser which will convert JSON to XML.
        this.parse = new Parse();

        // The actual Device class which has been defined with in the caller.
        this.DeviceClass = DeviceClass;

        // If we have a hardwareAddress explicitly set it, as the setter isn't called.
        if (hardwareAddress) {
            this.setDevice(hardwareAddress);
        }
    }


    /**
     * An alias to allow access to a device object.
     * @returns {boolean}
     * @constructor
     */
    get Device() {
        return this.device;
    }

    /**
     * An alias to allow access to a device object.
     * @param hardwareAddress
     * @constructor
     */
    set Device(hardwareAddress) {
        this.setDevice(hardwareAddress);
    }

    setDevice(hardwareAddress) {
        this.device = new this.DeviceClass(hardwareAddress, this);
    }


    /**
     * Converts an object property's date into locale string.
     *
     * Basically a byRef update on a date, uses this.date() function.
     *
     * @param object we want to update the date for
     * @param property which want to update.
     */
    convertDate(object, property) {
        object[property] = this.hexDate(object[property]);
    }


    convertHex(object,property) {

        let properties  = (Array.isArray(property)) ? property : [property];

        for( let i in properties ) {

            object[properties[i]] = this.hex(object[properties[i]]);
        }
    }


    hex(hexString) {
        return parseInt(hexString,16);
    }

    /**
     * Gets the response from the gate for for a command.
     *
     * In order to get a response, it will :
     *
     * 1) Convert to command from JSON to XML
     * 2) Send the command to the gateway
     * 3) Retrieve the JSON response
     * 5) Return the JSON response.
     *
     * @todo Try/Catch
     *
     * @param command JSON command.
     *
     * @returns {Promise<void>}
     */
    async get(command) {
        let requestXML = await this.parse.json(command);
        let response = await this.request.fetch(requestXML);
        return response;
    }

}

module.exports = Gateway;
