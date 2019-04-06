// Copyright (c) 2018-2019 KlasaCommunityPlugins. All rights reserved. MIT license.
import { Structures, TextChannel } from 'discord.js';
import { Settings } from 'klasa';

class ChannelGatewaysTextChannel extends TextChannel {
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
	settings: Settings | null = this.client.options.channelGateways[this.type] ? this.client.gateways[`${this.type}Channel`].get(this.id, true) : null;

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
