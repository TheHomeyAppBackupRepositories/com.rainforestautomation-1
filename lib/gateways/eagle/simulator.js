'use strict';

const parser = require('xml-js');

/**
 * Dummy Object
 *
 *
 * @author Jamie Peake
 * @since 1.0.0.0-alpha2
 * @date 2018-08-30
 * @temporary ::
 */
class Simulator {

    constructor () {}

    // Best Guess of returned values.
    async getNetworkInfo(){

        let result = {
            NetworkInfo: {
                DeviceMacId : '0xFFFFFFFFFFFFFFFF',
                CoordMacId  : '0xFFFFFFFFFFFFFFFF',
                LinkKeyHigh : '0xFFFFFFFFFFFFFFFF',
                LinkKeyLow  : '0xFFFFFFFFFFFFFFFF',
                FWVersion   : '{string}',
                HWVersion   : '{string}',
                Manufacturer: 'Rainforest Automation',
                ModelId     : 'RFA-Z109',
                DateCode    : '20180809ZZZZZZZZ',
                ImageType   : '0xFFFF',
                Protocol    : 'ZigBee'
            }
        };

        return result.NetworkInfo;
    }

    async getNetworStatus(){

        let result = {
            NetworkInfo: {
                DeviceMacId : '0xFFFFFFFFFFFFFFFF',
                CoordMacId  : '0xFFFFFFFFFFFFFFFF',
                Status      : 'Connected',
                Description : 'Apparently Optional String?',
                StatusCode  : '0xFF',
                ExtPanId    : '0xFFFFFFFFFFFFFFFF',
                Channel     : '00',
                ShortAddr   : '0xFFFF',
                LinkStrength: '0xFF'
            }
        };

        return result.NetworkInfo;
    }


    // Best Guess of returned values.
    async getInstantaneousDemand() {

        let result =  [
        {
            InstantaneousDemand: {
                DeviceMacId : '0xFFFFFFFFFFFFFFFF',
                MeterMacId  : '0xFFFFFFFFFFFFFFFF',
                TimeStamp   : '0xFFFFFFFF',
                Demand      : '0xFFFFFFFF',
                Multiplier  : '0xFFFFFFFF',
                Divisor     : '0xFFFFFFFF',
                DigitsRight : '0xFF',
                DigitsLeft  : '0xFF',
                SuppressLeadingZero: 'Y'
            }
        },
        {
            InstantaneousDemand: {
                DeviceMacId: '0x00158d0000000004',
                MeterMacId: '0x00178d0000000004',
                TimeStamp: '0x185adc1d',
                Demand: '0x001738',
                Multiplier: '0x00000001',
                Divisor: '0x000003e8',
                DigitsRight: '0x03',
                DigitsLeft: '0x00',
                SuppressLeadingZero: 'Y'
            }
        },
        {
            InstantaneousDemand: {
                DeviceMacId: '0x00158d0000000004',
                MeterMacId: '0x00178d0000000004',
                TimeStamp: '0x' + (Date.now() - 946684800000).toString(16),
                Demand: '0x' + Math.floor(Math.random() * 5000).toString(16),
                Multiplier: '0x00000001',
                Divisor: '0x000003e8',
                DigitsRight: '0x03',
                DigitsLeft: '0x00',
                SuppressLeadingZero: 'Y'
            }
        }



        ];



        return result[2].InstantaneousDemand;
    }

    // Best Guess of returned values.
    async getCurrentSummation() {

        let result =  {
            CurrentSummationDelivered: {
                DeviceMacId : '0xFFFFFFFFFFFFFFFF',
                MeterMacId  : '0xFFFFFFFFFFFFFFFF',
                TimeStamp   : '0x' + (Date.now() - 946684800000).toString(16),
                SummationDelivered      :  Math.floor(Math.random() * 50000).toString(16),
                SummationReceived       :  Math.floor(Math.random() * 10000).toString(16),
                Multiplier  : '0x00000001',
                Divisor     : '0x000003e8',
                DigitsRight : '0x03',
                DigitsLeft  : '0x00',
                SuppressLeadingZero: 'Y'
            }
        };

        return result.CurrentSummationDelivered;
    }

    // Undocumented : Untested : Different format than API docs.
    async getUsage() {
        return {
            meter_status:"Connected", 
            demand:"0.5700",
             demand_units:"kW",
            demand_timestamp:"1536235984",
            summation_received:"0.000", 
            summation_delivered:"42351.001",
            summation_units:"kWh",
            price:"0.1759", 
            price_units:"840", 
            price_label:"Set by User",
            message_timestamp:"946684800",
            message_confirmed:"N",
            message_confirm_required:"N",
            message_id:"0",
            message_queue:"active", 
            message_read:"Y",
            threshold_upper_demand:"11.548000",
            threshold_lower_demand:"-2.000000",
            fast_poll_frequency:"0x00", 
            fast_poll_endtime:"0x00000000"
        };
    }


    // Placeholders
    async getDeviceInfo(){}
    async getPriceCluster(){}
    async getMeterInfo(){}
    async fetch(command){}
}

module.exports = Simulator;