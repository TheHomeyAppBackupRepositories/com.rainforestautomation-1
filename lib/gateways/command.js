'use strict';

/**
 * Class used to create the Eagle commands.
 *
 * Set/Get the Hardware Address, which is requires for some commands.
 *
 * Eagle-1 : hardwareAddress is the MacId of the Eagle-1
 * Eagle-200 : hardwareAddress is the MacId of the Device attached to the Eagle-200
 *
 * @author Jamie Peake <jamie.peake@gmail.com>
 * @since 1.1.0
 * @version 1.1.0 : Separate out command and add inheritance for support ofr multiple gateways  : JP
 * @date 2018-09-08
 */
class Command {

    constructor(hardwareAddress = false) {

        // Initialise the Hardware Address
        this._HardwareAddress = hardwareAddress;

    };

    /**
     * Setter : Internal HardwareAddress
     *
     * @param HardwareAddress
     * @constructor
     */
    set HardwareAddress(HardwareAddress)
    {
        this._HardwareAddress = HardwareAddress;
    }


    /**
     * Getter : Internal HardwareAddress
     *
     * @returns {boolean|*}
     * @constructor
     */
    get HardwareAddress()
    {
        return this._HardwareAddress;
    }
}

module.exports = Command;

