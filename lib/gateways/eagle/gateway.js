'use strict';

const GenericGateway = require('../gateway');
const Command = require('./command');
const Simulator = require('./simulator');
const Device = require('./device');

/**
 * Gateway class, used to access the Eagle gateway itself.
 *
 * All calls to a specific device upon the gateway should be done through the gateway.device,
 * once the devices hardwareAddress has been supplied. (setter/constructor)
 *
 * @author Jamie Peake
 * @since 1.1.0.0
 * @date 2018-09-08
 */
class Gateway extends GenericGateway {

    /**
     * Sets the generic gateway and specifies the command class.
     *
     * Note that the hardware address for an original Eagle is the EAGLES MacId
     * @param ipAddress
     * @param settings
     * @param hardwareAddress
     */
    constructor (ipAddress, settings, hardwareAddress = false) {

        super(ipAddress, settings, hardwareAddress, Device);

        this.command = new Command(hardwareAddress);
    }



    /**
     * Return the network status of the gateway.
     *
     * @returns {Promise<void>}
     * @constructor
     */
    get NetworkInfo() {
        return this.get(this.command.NetworkInfo);
    }


    /**
     * Return the network status of the gateway.
     *
     * @returns {Promise<void>}
     * @constructor
     */
    get ListNetwork() {
        return this.get(this.command.ListNetwork);
    }


    /**
     * Return the network status of the gateway.
     *
     * @returns {Promise<void>}
     * @constructor
     */
    get NetworkStatus() {
        return this.get(this.command.NetworkStatus);
    }

    /**
     * Overwrite the get with a dummy class for testing a device, I don't own.
     * @param command
     * @returns {Promise<*>}
     */
    async get(command) {

        // Return the results.
        // COMMENT THIS LINE OUT IN ORDER TO USE SIMULATION
        return await super.get(command);

        let dummy = new Simulator();

        if (command.LocalCommand.Name == 'get_instantaneous_demand') {
            return dummy.getInstantaneousDemand();
        } else if (command.LocalCommand.Name == 'get_current_summation') {
            return dummy.getCurrentSummation();
        } else if (command.LocalCommand.Name == 'get_network_info') {
            return dummy.getNetworkInfo();
        }

    }

    /**
     * Converts a gateway date, which seems to be a hexDate stamp in seconds since 2000???
     * @note : this is a complete guess.
     * @param hexDate
     * @returns {string}
     */
    hexDate(hexDate) {

        let date = new Date((parseInt(hexDate,16) * 1000) + (946684800 * 1000) );
        return date.toLocaleString();
    }

}

module.exports = Gateway;
