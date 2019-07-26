// Copyright (c) 2018-2019 KlasaCommunityPlugins. All rights reserved. MIT license.
import { Structures } from 'discord.js';
import { Settings } from 'klasa';

class ChannelGatewaysCategoryChannel extends Structures.get('CategoryChannel') {
	/**
	 * @typedef {external:CategoryChannelJSON} CategoryChannelJSON
	 * @property {external:SettingsJSON} settings The per category channel settings
	 */

	/**
	 * The category channel settings
	 * @since 1.0.0
	 * @type {Settings|null}
	 */
	// @ts-ignore
	settings: Settings | null = this.client.options.channelGateways[this.type] ? this.client.gateways.get(`${this.type}Channel`).get(this.id, true) : null;

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 1.0.0
	 * @returns {CategoryChannelJSON}
	 */
	toJSON() {
		return { ...super.toJSON(), settings: this.settings ? this.settings.toJSON() : null };
	}
}

Structures.extend('CategoryChannel', () => ChannelGatewaysCategoryChannel);

export { ChannelGatewaysCategoryChannel };
