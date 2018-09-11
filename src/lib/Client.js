const { join } = require('path');
const { Client, Schema, util: { mergeDefault } } = require('klasa');
const { CLIENT } = require('./util/constants');
const TextChannelGateway = require('./settings/TextChannelGateway');

Client.defaultTextChannelSchema = new Schema();

module.exports = class extends Client {

	constructor(options) {
		super(options);
		this.constructor[Client.plugin].call(this);
	}

	static [Client.plugin]() {
		mergeDefault(CLIENT, this.options);
		const { textchannels } = this.options.gateways;
		const textchannelSchema = 'schema' in textchannels ? textchannels.schema : this.constructor.defaultTextChannelSchema;

		this.gateways.textchannels = new TextChannelGateway(this.gateways, 'textchannels', textchannelSchema, textchannels.provider || this.options.providers.default);
		this.gateways.keys.add('textchannels');
		this.gateways._queue.push(this.gateways.textchannels.init.bind(this.gateways.textchannels));


		this.commands.registerCoreDirectory(join(__dirname, '..', '/'));
	}

};
