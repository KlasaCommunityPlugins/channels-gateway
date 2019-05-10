// Copyright (c) 2018-2019 KlasaCommunityPlugins. All rights reserved. MIT license.
import { Structures } from 'discord.js';
import { Settings } from 'klasa';

class ChannelGatewaysVoiceChannel extends Structures.get('VoiceChannel') {
	/**
	 * @typedef {external:VoiceChannelJSON} VoiceChannelJSON
	 * @property {external:SettingsJSON} settings The per voice channel settings
	 */

	/**
	 * The voice channel settings
	 * @since 1.0.0
	 * @type {Settings|null}
	 */
	// @ts-ignore
	settings: Settings | null = this.client.options.channelGateways[this.type] ? this.client.gateways[`${this.type}Channel`].get(this.id, true) : null;

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 1.0.0
	 * @returns {VoiceChannelJSON}
	 */
	toJSON() {
		return { ...super.toJSON(), settings: this.settings ? this.settings.toJSON() : null };
	}
}

Structures.extend('VoiceChannel', () => ChannelGatewaysVoiceChannel);

export { ChannelGatewaysVoiceChannel };
