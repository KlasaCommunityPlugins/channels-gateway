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

	static [Client.plugin]() {
		const typedThis = this as unknown as ChannelGatewaysClient;
		util.mergeDefault(OPTIONS, typedThis.options);

		const coreDirectory = join(__dirname, '..', '/');

		// @ts-ignore
		typedThis.commands.registerCoreDirectory(coreDirectory);

		const { channelGateways, gateways } = typedThis.options;
		const { categoryChannel, textChannel, voiceChannel } = gateways;

		categoryChannel!.schema = 'schema' in categoryChannel! ? categoryChannel!.schema : Client.defaultCategoryChannelSchema;
		textChannel!.schema = 'schema' in textChannel! ? textChannel!.schema : Client.defaultTextChannelSchema;
		voiceChannel!.schema = 'schema' in voiceChannel! ? voiceChannel!.schema : Client.defaultVoiceChannelSchema;

		categoryChannel!.provider = 'provider' in categoryChannel! ? categoryChannel!.provider : typedThis.options.providers.default;
		textChannel!.provider = 'provider' in textChannel! ? textChannel!.provider : typedThis.options.providers.default;
		voiceChannel!.provider = 'provider' in voiceChannel! ? voiceChannel!.provider : typedThis.options.providers.default;

		// Settings branch code
		/*
		if (channelGateways.category) typedThis.gateways.register(new GuildChannelGateway(typedThis, 'categoryChannel', categoryChannel));
		if (channelGateways.text) typedThis.gateways.register(new GuildChannelGateway(typedThis, 'textChannel', textChannel));
		if (channelGateways.voice) typedThis.gateways.register(new GuildChannelGateway(typedThis, 'voiceChannel', voiceChannel));
		*/

		if (channelGateways.category) {
			typedThis.gateways.categoryChannel = new GuildChannelGateway(typedThis.gateways, 'categoryChannel', categoryChannel!.schema!, categoryChannel!.provider!);
			typedThis.gateways.keys.add('categoryChannel');
			// @ts-ignore
			typedThis.gateways._queue.push(typedThis.gateways.categoryChannel.init.bind(typedThis.gateways.categoryChannel));
		}

		if (channelGateways.text) {
			typedThis.gateways.textChannel = new GuildChannelGateway(typedThis.gateways, 'textChannel', textChannel!.schema!, textChannel!.provider!);
			typedThis.gateways.keys.add('textChannel');
			// @ts-ignore
			typedThis.gateways._queue.push(typedThis.gateways.textChannel.init.bind(typedThis.gateways.textChannel));
		}

		if (channelGateways.voice) {
			typedThis.gateways.voiceChannel = new GuildChannelGateway(typedThis.gateways, 'voiceChannel', voiceChannel!.schema!, voiceChannel!.provider!);
			typedThis.gateways.keys.add('voiceChannel');
			// @ts-ignore
			typedThis.gateways._queue.push(typedThis.gateways.voiceChannel.init.bind(typedThis.gateways.voiceChannel));
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
