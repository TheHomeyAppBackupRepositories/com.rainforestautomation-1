
<p align="center">
  <img src="https://cdn.rawgit.com/hive/com.rainforestautomation/master/assets/icon-horizontal.svg"  width="50%">
</p>


#

# Rainforest Automation



Adds support for Rainforest Automation gateways to Athom Homey. 


#

**Pairing**

In order to pair a new device, you will need your gateway details (found on the bottom of your gateway) and preferably your gateway should be statically assigned an IP address using your router. 


**Tested**

This library has been tested connecting to Generic Zigbee Smart Power Meter through an Eagle-200 gateway.
    
**Features**
    
    Power Metering 
    Power Measuring
       
**Settings**
   
    Power Meter Polling Frequency
    Power Measure Polling Frequency
    Gateway IP Address
        
**Languages**
    
    English (Australian)
        
## Change Log

Available in .homeychangelog.json
    

        

## Future Ideas

    * Repair on IP address changed. 
    * Add new capability for power meter which uses mWh units.
    * Add new capability for power measure which uses kW units. 
    * Add additional store too allow 'power meter' value to be reset.
    * Add flow cards
        * measure power
        * delivered meter power
        * received meter power
        * reset meter power
    * Add settings
        * Customise 'meter power'
            * delivered meter power
            * received meter power
            * (delivered - received) meter power
    * Add additional devices capabilities.
        * Switches
        * Heaters
    * Pull billing periods
