'use strict';

const parser = require('xml-js');

/**
 * Parses our commands, converting them to/from JSON/XML. As the gateway will only accept/return XML.
 *
 * @author Jamie Peake
 * @since 1.0.0.0-alpha2
 * @date 2018-08-30
 */
class Parse {

    /**
     * Build the request-promise-native options
     *
     * Its not recommended to change these values.
     */
    constructor () {

        // Initialise the options,and
        this.options = {
            xml2js: {
                compact: true,
                spaces: 4,
                trim: true,
                ignoreDeclaration: true,
                ignoreInstruction: true,
                ignoreAttributes: true,
                ignoreComment: true,
                ignoreCdata: true,
                ignoreDoctype: true,
                textFn: function(value,parentElement){
                    try{
                        var keyNo = Object.keys(parentElement._parent).length;
                        var keyName = Object.keys(parentElement._parent)[keyNo-1];
                        parentElement._parent[keyName] = value;
                    }
                    catch(e){}
                }
            },
            json2xml: {
                compact: true,
                ignoreComment: true,
                spaces: 4
            }
        };

    }

    /**
     * Parses json string into xml
     * @param string the JSON to parse
     * @returns {Promise<*>}
     */
    async json(string) {
        return await parser.json2xml(string, this.options.json2xml);
    }

    /**
     * Parses an xml string into JS.
     * @param string the XML to parse
     * @returns {Promise<*>}
     */
    async xml(string) {
        return await parser.xml2js(string, this.options.xml2js);
    }
}

module.exports = Parse;