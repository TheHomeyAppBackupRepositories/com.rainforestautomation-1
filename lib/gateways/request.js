'use strict';

const http = require('phin');

/**
 * Make the actual requests to the gateway.
 *
 * Basically a Helper for phin, which assigns the object with the required options.
 *
 * @author Jamie Peake
 * @since 1.0.0.0-alpha2
 * @date 2018-08-30
 */
class Request {

    /**
     * Request address/header and build the phin options.
     * @param ipAddress string IP Address of the Gateway
     * @param settings object of the Gateway setting ({cloudId, macAddress, installCode})
     */
    constructor(ipAddress, settings, options) {

        // Initialise the gateway IP address
        this.ipAddress = ipAddress;

        // Initialise the gateway settings.
        this.settings = Object.assign({
            cloudId: false, 
            macAddress: false,
            installCode: false,
            path: '/cgi-bin/post_manager'      // Set REST path
        }, settings);

        // Initialise the options from the settings & IP
        this.options = Object.assign({
            url: 'http://' + this.ipAddress,
            path: this.settings.path,
            method: 'POST',
            'auth': this.settings.cloudId + ':' + this.settings.installCode,
            headers: {
                'Content-Type': 'Content-Type: text/xml'
            }
        }, options);
    }

    /**
     * Fetches the results to a command
     *
     * Promisefiy and assign default options, finally return the body as a string.
     *
     * @param command string the XML for the eagle200 command.
     * @returns {Promise<void>}
     */
    async fetch(command) {

        //Convert into Promise
        return new Promise((resolve, reject) => {
            // Assign required options, note data not body & length hard set
            let options = this.options;
            options.data = command;
            options.headers['Content-Length'] = Buffer.byteLength(command);
            
            http(options, (err, res) => {
                
                if (err) {
                    reject(err);
                    return;
                } 
                
                if (res.statusCode !== 200) {
                    console.log('Fetch Error : ' + res.statusMessage + ' ' + res.statusCode); 
                    reject(res.statusCode)
                    return;
                } 

                resolve(res.body.toString())
            }, http)
        })
    }
}

module.exports = Request;
