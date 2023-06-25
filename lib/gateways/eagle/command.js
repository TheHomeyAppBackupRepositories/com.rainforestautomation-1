'use strict';

const GatewayCommand = require('../command');

/**
 * Class used to create the original Eagle commands.
 *
 * Builds the required command structure, ie. the object which is converted to XML and sent to the device as a request.
 *
 * Please note that the original Eagle gateway commands were only able to connect to one device, and as such anything
 * to do with device identification is not needed (where it is needed in the eagle-200). For example, rather then
 * supply a deviceID, the original Eagle actually only requires its own macAddress for identification.
 *
 * @author Jamie Peake <jamie.peake@gmail.com>
 * @since 1.1.0.0
 * @date 2018-09-08
 */
class Command extends GatewayCommand {

    /**
     * @param hardwareAddress of the EAGLE device
     */
    constructor(hardwareAddress = false) {

        super(hardwareAddress);

        /**
         * List of command templates to use.
         *
         * @type {{NetworkInfo: {LocalCommand: {Name: string, Format: string}}, ListNetwork: {LocalCommand: {Name: string, Format: string}}, NetworkStatus: {LocalCommand: {Name: string, Format: string}}, InstantaneousDemand: {LocalCommand: {Name: string, Format: string, MacId: boolean}}, Price: {LocalCommand: {Name: string, Format: string, MacId: boolean}}, CurrentSummation: {LocalCommand: {Name: string, Format: string, MacId: boolean}}}}
         * @private
         */
        this._commands = {
            'NetworkInfo': {
                'LocalCommand': {
                    'Name': 'get_network_info',
                    'Format' : 'JSON'
                }
            },
            'ListNetwork': {
                'LocalCommand': {
                    'Name': 'list_network',
                    'Format' : 'JSON'
                }
            },
            'NetworkStatus': {
                'LocalCommand': {
                    'Name': 'get_network_status',
                    'Format' : 'JSON'
                }
            },
            'InstantaneousDemand': {
                'LocalCommand': {
                    'Name': 'get_instantaneous_demand',
                    'Format' : 'JSON',
                    'MacId' : hardwareAddress,
                }
            },
            'Price': {
                'LocalCommand': {
                    'Name': 'get_price',
                    'Format' : 'JSON',
                    'MacId' : hardwareAddress
                }
            },
            'CurrentSummation' : {
                'LocalCommand': {
                    'Name': 'get_current_summation',
                    'Format' : 'JSON',
                    'MacId' : hardwareAddress
                }
            },
            'DemandPeaks' : {
                'LocalCommand': {
                    'Name': 'get_demand_peaks',
                    'Format' : 'JSON',
                    'MacId' : hardwareAddress
                }
            },
        };
    };


    /**
     * When getting the commands, place the hardware address into it where required.
     *
     * @returns {{NetworkInfo: {LocalCommand: {Name: string, Format: string}}, ListNetwork: {LocalCommand: {Name: string, Format: string}}, NetworkStatus: {LocalCommand: {Name: string, Format: string}}, InstantaneousDemand: {LocalCommand: {Name: string, Format: string, MacId: boolean}}, Price: {LocalCommand: {Name: string, Format: string, MacId: boolean}}, CurrentSummation: {LocalCommand: {Name: string, Format: string, MacId: boolean}}}|{DeviceList: {Command: {Name: string}}, WifiStatus: {Command: {Name: string}}, DeviceQuery: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}, Components: {Component: {Name: string, Variables: Array}}}}, DeviceDetails: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}}}, DeviceQueryAll: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}, Components: {All: string}}}}}
     */
    get commands()
    {
        let commands = this._commands;

        commands.InstantaneousDemand.LocalCommand.MacId = this.HardwareAddress;
        commands.Price.LocalCommand.MacId = this.HardwareAddress;
        commands.CurrentSummation.LocalCommand.MacId = this.HardwareAddress;
        commands.DemandPeaks.LocalCommand.MacId = this.HardwareAddress;

        return commands;
    }

    /**
     *
     * @returns {{LocalCommand: {Name: string, Format: string}}}
     * @constructor
     */
    get NetworkInfo()
    {
        return this.commands.NetworkInfo;
    }


    /**
     * Lists all devices upon the gateway networkin, including USB
     * @returns {{LocalCommand: {Name: string, Format: string}}}
     * @constructor
     */
    get ListNetwork()
    {
        return this.commands.ListNetwork;
    }

    /**
     * Returns the network status of the gateway
     *
     * @returns {{LocalCommand: {Name: string, Format: string}}}
     * @constructor
     */
    get NetworkStatus()
    {
        return this.commands.NetworkStatus;
    }



    /**
     * Returns the current power demand
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {*}
     * @constructor
     */
    get InstantaneousDemand()
    {
        // If no hardware address has been defined, throw an error.
        if (this._HardwareAddress) {
            return this.commands.InstantaneousDemand;
        } else {
            throw 'The Hardware address must be defined in order to retrieve InstantaneousDemand';
        }
    }


    /**
     * Return the summation of power, which includes delivered and received.
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {*}
     * @constructor
     */
    get CurrentSummation()
    {
        if (this._HardwareAddress) {
            return this.commands.CurrentSummation;
        } else {
            throw 'The Hardware address must be defined in order to retrieve CurrentSummation';
        }
    }

    /**
     * Returns the current power demand
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {*}
     * @constructor
     */
    get DemandPeaks()
    {
        // If no hardware address has been defined, throw an error.
        if (this._HardwareAddress) {
            return this.commands.DemandPeaks;
        } else {
            throw 'The Hardware address must be defined in order to retrieve DemandPeaks';
        }
    }

}

module.exports = Command;

