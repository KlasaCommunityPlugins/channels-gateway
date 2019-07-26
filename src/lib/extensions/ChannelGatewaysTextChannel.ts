// Copyright (c) 2018-2019 KlasaCommunityPlugins. All rights reserved. MIT license.
import { Structures } from 'discord.js';
import { Settings } from 'klasa';

class ChannelGatewaysTextChannel extends Structures.get('TextChannel') {
	/**
	 * @typedef {external:TextChannelJSON} TextChannelJSON
	 * @property {external:SettingsJSON} settings The per text channel settings
	 */

	/**
	 * The text channel settings
	 * @since 1.0.0
	 * @type {Settings|null}
	 */
	// @ts-ignore
	settings: Settings | null = this.client.options.channelGateways[this.type] ? this.client.gateways.get(`${this.type}Channel`).acquire(this) : null;

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 1.0.0
	 * @returns {TextChannelJSON}
	 */
	toJSON() {
		return { ...super.toJSON(), settings: this.settings ? this.settings.toJSON() : null };
	}
}

Structures.extend('TextChannel', () => ChannelGatewaysTextChannel);

export { ChannelGatewaysTextChannel };
