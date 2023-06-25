'use strict';
const GatewayCommand = require('../command');

/**
 * Class used to create the Eagle200 commands.
 *
 * Builds the required command structure, ie. the object which is converted to XML and sent to the device as a request.
 *
 * @author Jamie Peake <jamie.peake@gmail.com>
 * @since 1.0.0-alpha2
 * @version 1.1.0 refactor code, add inheritance for multiple gateway support : JP : 2018-09-08
 */
class Command extends GatewayCommand {

    constructor(hardwareAddress = false) {

        super(hardwareAddress);

        /**
         * List of command templates to use.
         *
         * @todo Add device setting.
         *
         * @type {{DeviceList: {Command: {Name: string}}, WifiStatus: {Command: {Name: string}}, DeviceQuery: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}, Components: {Component: {Name: string, Variables: Array}}}}, DeviceDetails: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}}}, DeviceQueryAll: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}, Components: {All: string}}}}}
         * @private
         */
        this._commands = {
            'DeviceList': {
                'Command': {
                    'Name': 'device_list'
                }
            },
            'WifiStatus': {
                'Command': {
                    'Name': 'wifi_status'
                }
            },
            'DeviceQuery': {
                'Command': {
                    'Name': 'device_query',
                    'DeviceDetails': {
                        'HardwareAddress': '{value}'
                    },
                    'Components': {
                        'Component': {
                            'Name': 'Main',
                            'Variables': []
                        }
                    }
                }
            },
            'DeviceDetails': {
                'Command': {
                    'Name': 'device_details',
                    'DeviceDetails': {
                        'HardwareAddress': '{value}'
                    }
                }
            },
            'DeviceQueryAll' : {
                'Command': {
                    'Name': 'device_query',
                    'DeviceDetails': {
                        'HardwareAddress': '{value}'
                    },
                    'Components': {'All': 'Y'}
                }
            }
        };


        /**
         * Which variables can be delivered to the device_query, there are actually plenty more available variables.
         *
         * @todo Add additional variables
         * @todo dynamically retrieve which variables are available for the current device and populate this.
         *
         * @type {{InstantaneousDemand: {Variable: {Name: string}}, CurrentSummationDelivered: {Variable: {Name: string}}, CurrentSummationReceived: {Variable: {Name: string}}}}
         */
        this.variables = {
            'InstantaneousDemand': {
                'Variable': {
                    'Name': 'zigbee:InstantaneousDemand'
                }
            },
            'CurrentSummationDelivered': {
                'Variable': {
                    'Name': 'zigbee:CurrentSummationDelivered'
                }
            },
            'CurrentSummationReceived': {
                'Variable': {
                    'Name': 'zigbee:CurrentSummationReceived'
                }
            },
            'BillingPeriodStart': {
                'Variable': {
                    'Name': 'zigbee:BillingPeriodStart'
                }
            },
        };
    };


    /**
     *  Allows easy access to the Device Query, specifying which variables are required.
     *
     * @param variables
     * @returns {{Command: {Name: string, DeviceDetails: {HardwareAddress: string}, Components: {}}}}
     */
    query(variables = [])
    {
        let body = this.commands.DeviceQuery;

        if (variables.length) {
            body.Command.Components.Component.Variables = variables;
        }

        return body;
    }


    /**
     * When getting the commands, place the hardware address into it where required.
     *
     * @returns {{DeviceList: {Command: {Name: string}}, WifiStatus: {Command: {Name: string}}, DeviceQuery: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}, Components: {}}}, DeviceDetails: {Command: {Name: string, DeviceDetails: {HardwareAddress: string}}}}}
     */
    get commands()
    {
        let commands = this._commands;

        commands.DeviceDetails.Command.DeviceDetails.HardwareAddress = this.HardwareAddress;
        commands.DeviceQuery.Command.DeviceDetails.HardwareAddress = this.HardwareAddress;
        commands.DeviceQueryAll.Command.DeviceDetails.HardwareAddress = this.HardwareAddress;

        return commands;
    }


    /**
     * Returns the commands to get the Wifi Status of the Eagle-200 device.
     *
     * @returns {{Command: {Name: string}}}
     * @constructor
     */
    get WifiStatus()
    {
        return this.commands.WifiStatus;
    }


    /**
     * Returns the command to retrieve the device list attached to the Eagle
     * Note that while this is both the Smart Meter and any other devices, this class
     * will only handle calls for the Smart Meter.
     *
     * @returns {{Command: {Name: string}}}
     * @constructor
     */
    get DeviceList()
    {
        return this.commands.DeviceList;
    }


    /**
     * Returns the command to retrieve the details of the current Hardware Address
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {{Command: {Name: string}}}
     * @constructor
     */
    get DeviceDetails()
    {
        if (this._HardwareAddress) {
            return this.commands.DeviceDetails;
        } else {
            throw 'The Hardware address must be defined in order to retrieve the device details';
        }
    }


    /**
     * Alias to return ALL the values of a device.
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {{Command: {Name: string}}}
     * @constructor
     */
    get DeviceQueryAll()
    {
        if (this._HardwareAddress) {
            return this.commands.DeviceQueryAll;
        } else {
            throw 'The Hardware address must be defined in order to retrieve the device query all';
        }
    }


    /**
     * Returns the current power demand, through use of the device_query
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {*}
     * @constructor
     */
    get InstantaneousDemand()
    {
        if (this._HardwareAddress) {
            return this.query([this.variables.InstantaneousDemand]);
        } else {
            throw 'The Hardware address must be defined in order to retrieve InstantaneousDemand';
        }
    }


    /**
     * Returns the current power demand, through use of the device_query
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {*}
     * @constructor
     */
    get BillingPeriodStart()
    {
        if (this._HardwareAddress) {
            return this.query([this.variables.BillingPeriodStart]);
        } else {
            throw 'The Hardware address must be defined in order to retrieve InstantaneousDemand';
        }
    }


    /**
     * Return the total delivered power, through the use of a device_query.
     *
     * @throws exception if no hardwareAddress has been set.
     * @returns {*}
     * @constructor
     */
    get CurrentSummationDelivered()
    {
        if (this._HardwareAddress) {
            return this.query([this.variables.CurrentSummationDelivered]);
        } else {
            throw 'The Hardware address must be defined in order to retrieve CurrentSummationDelivered';
        }
    }


    /**
     * Returns the total received power, through the use of a device_query
     *
     * Assuming that this is used when solar/generator/etc is attached?
     *
     * @returns {*}
     * @constructor
     */
    get CurrentSummationReceived()
    {
        if (this._HardwareAddress) {
            return this.query([this.variables.CurrentSummationReceived]);
        } else {
            throw 'The Hardware address must be defined in order to retrieve CurrentSummationReceived';
        }
    }
}

module.exports = Command;

