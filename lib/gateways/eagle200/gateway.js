'use strict';

const GenericGateway = require('../gateway');
const Command = require('./command');
const Device = require('./device');

/**
 * Gateway class, used to access the Eagle200 gateway itself.
 *
 * All calls to a specific device upon the gateway should be done through the gateway.device,
 * once the devices hardwareAddress has been supplied. (setter/constructor)
 *
 * @author Jamie Peake
 * @since 1.0.0.0-alpha2
 * @date 2018-08-30
 * @version 1.1.0.0 refactor code, add inheritance for multiple gateway support : JP : 2018-09-08
 *
 */
class Gateway extends GenericGateway {

    constructor (ipAddress, settings = {}, hardwareAddress = false) {

        super(ipAddress, settings, hardwareAddress);

        this.command = new Command();
    }


    // Alias Getters to their respective functions.
    get DeviceList() { return this.getDeviceList(); }
    
    /**
     * Returns a device list.
     *
     * Assumes what will happen if multiple devices but only one device on hand for testing.
     *
     * @todo test when no devices are returned, the API documentation doesn't specify what will be returned.
     * @todo test when multiple devices are returned, the API documentation doesn't specify what will be returned.
     * @todo add Catch.
     *
     * @returns {Promise<void>}
     */
    getDeviceList() {
        
        // Get the device list
        return this.get(this.command.DeviceList).then( (response) => {


            console.log('---- response -----');
            console.log(response);
            console.log('/---- response -----');


            // Check the device list for items, ensure that it always returns an array for consistency.
            let devices = (Array.isArray(response.DeviceList.Device)) ? response.DeviceList.Device : [response.DeviceList.Device];

            // Loop through fixing the dates of any devices.
            for( let i in devices ) {

                // GIGO Check
                if (devices[i].hasOwnProperty('LastContact')) {
                    this.convertDate(devices[i], 'LastContact');
                }
            }

            return devices;
        });

    }


    /**
     * Return the wifi status of the gateway.
     *
     * Note by default wifi is disabled and the gateway actually uses an RF45 ethernet connection
     *
     * @returns {Promise<void>}
     * @constructor
     */
    get WifiStatus() {
        return this.get(this.command.WifiStatus);
    }

    get isAuthorized() {
        return this.get(this.command.WifiStatus).then((result) => {
            return true;
        }).catch( (error) => {
            return false; 
        }); 
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

        this.device = new Device(hardwareAddress, this);
    }

    /**
     * Gets the response from the gate for for a command.
     *
     * In order to get a response, it will :
     *
     * 1) Convert to command from JSON to XML
     * 2) Send the command to the gateway
     * 3) Retrieve the XML returned
     * 4) Convert the XML back into JSON
     * 5) Return the JSON response.
     *
     * @todo Try/Catch
     *
     * @param command JSON command.
     *
     * @returns {Promise<void>}
     */
    async get(command) {
        let responseXML = await super.get(command);
        return await this.parse.xml(responseXML);
    }

    /**
     * Converts a gateway date, which seems to be a hexDate stamp in seconds?
     * @param hexDate
     * @returns {string}
     */
    hexDate(hexDate) {
        let date = new Date(parseInt(hexDate,16) * 1000);
        return date.toLocaleString();
    }

}

module.exports = Gateway;
