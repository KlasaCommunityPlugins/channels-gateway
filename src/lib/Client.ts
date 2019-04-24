// Copyright (c) 2018-2019 KlasaCommunityPlugins. All rights reserved. MIT license.
import { Client, KlasaClientOptions, Schema, Settings, util } from 'klasa';
import { join } from 'path';
import { GuildChannelGateway } from './settings/gateways/GuildChannelGateway';
import { OPTIONS } from './util/CONSTANTS';

Client.defaultTextChannelSchema = new Schema();
Client.defaultVoiceChannelSchema = new Schema();
Client.defaultCategoryChannelSchema = new Schema();

/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @extends external:KlasaClient
 * @tutorial GettingStarted
 */
export class ChannelGatewaysClient extends Client {
	/**
	 * @typedef {external:KlasaClientOptions} ChannelGatewaysClientOptions
	 * @property {GatewayOptions} [channelGateways={}]
	 */

	/**
	 * Which gateway to enable for the channel type. They can be enabled and disabled at any point in time
	 * @typedef {GatewayOptions}
	 * @property {boolean} [text=true]
	 * @property {boolean} [voice=true]
	 * @property {boolean} [category=true]
	 */

	/**
	 * Constructs the gateways client.
	 * @since 1.0.0
	 * @param {ChannelGatewaysClientOptions} [options] The options to pass to the new client
	 */
	constructor(options?: KlasaClientOptions) {
		super(options);
		// @ts-ignore
		this.constructor[Client.plugin].call(this);
	}

	static [Client.plugin](this: ChannelGatewaysClient) {
		util.mergeDefault(OPTIONS, this.options);

		const coreDirectory = join(__dirname, '..', '/');

		// @ts-ignore
		this.commands.registerCoreDirectory(coreDirectory);

		const { channelGateways, gateways } = this.options;
		const { categoryChannel, textChannel, voiceChannel } = gateways;

		categoryChannel!.schema = 'schema' in categoryChannel! ? categoryChannel!.schema : Client.defaultCategoryChannelSchema;
		textChannel!.schema = 'schema' in textChannel! ? textChannel!.schema : Client.defaultTextChannelSchema;
		voiceChannel!.schema = 'schema' in voiceChannel! ? voiceChannel!.schema : Client.defaultVoiceChannelSchema;

		categoryChannel!.provider = 'provider' in categoryChannel! ? categoryChannel!.provider : this.options.providers.default;
		textChannel!.provider = 'provider' in textChannel! ? textChannel!.provider : this.options.providers.default;
		voiceChannel!.provider = 'provider' in voiceChannel! ? voiceChannel!.provider : this.options.providers.default;

		// Settings branch code
		/*
		if (channelGateways.category) this.gateways.register(new GuildChannelGateway(this, 'categoryChannel', categoryChannel));
		if (channelGateways.text) this.gateways.register(new GuildChannelGateway(this, 'textChannel', textChannel));
		if (channelGateways.voice) this.gateways.register(new GuildChannelGateway(this, 'voiceChannel', voiceChannel));
		*/

		if (channelGateways.category) {
			this.gateways.categoryChannel = new GuildChannelGateway(this.gateways, 'categoryChannel', categoryChannel!.schema!, categoryChannel!.provider!);
			this.gateways.keys.add('categoryChannel');
			// @ts-ignore
			this.gateways._queue.push(this.gateways.categoryChannel.init.bind(this.gateways.categoryChannel));
		}

		if (channelGateways.text) {
			this.gateways.textChannel = new GuildChannelGateway(this.gateways, 'textChannel', textChannel!.schema!, textChannel!.provider!);
			this.gateways.keys.add('textChannel');
			// @ts-ignore
			this.gateways._queue.push(this.gateways.textChannel.init.bind(this.gateways.textChannel));
		}

		if (channelGateways.voice) {
			this.gateways.voiceChannel = new GuildChannelGateway(this.gateways, 'voiceChannel', voiceChannel!.schema!, voiceChannel!.provider!);
			this.gateways.keys.add('voiceChannel');
			// @ts-ignore
			this.gateways._queue.push(this.gateways.voiceChannel.init.bind(this.gateways.voiceChannel));
		}
	}
}

declare module 'klasa' {
	namespace Client {
		export let defaultTextChannelSchema: Schema;
		export let defaultVoiceChannelSchema: Schema;
		export let defaultCategoryChannelSchema: Schema;
	}

	// TODO(Vlad): Remove this once settings branch is merged
	interface GatewayDriver {
		categoryChannel?: GuildChannelGateway;
		textChannel?: GuildChannelGateway;
		voiceChannel?: GuildChannelGateway;
	}

	interface KlasaClientOptions {
		channelGateways?: {
			text?: boolean;
			voice?: boolean;
			category?: boolean;
		};
	}

	interface GatewaysOptions {
		categoryChannel?: GatewayDriverRegisterOptions;
		textChannel?: GatewayDriverRegisterOptions;
		voiceChannel?: GatewayDriverRegisterOptions;
	}
}

declare module 'discord.js' {
	interface GuildChannel {
		settings: Settings | null;
	}
}
