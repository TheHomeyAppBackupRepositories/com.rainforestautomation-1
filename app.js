'use strict';

const Homey = require('homey');
const { Log } = require('homey-log');
const Logger = require('./lib/logger');

class rainforestAutomation extends Homey.App {

  async onInit() {
    this.debug = process.env.DEBUG;
    this.sentry =  new Log({ homey: this.homey });

    this.logger = new Logger('info', 'app');
    this.logger.setDebug(this.debug);
    this.logger.info('Starting Application');
  }
}

module.exports = rainforestAutomation;
