const { GatewayStorage, Settings, util: { getIdentifier } } = require('klasa');
const { Collection } = require('discord.js');

/**
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
class TextChannelGateway extends GatewayStorage {
	/**
	 * Get a Settings entry from this gateway
	 * @since 0.0.1
	 * @param {string|string[]} id The id for this instance
	 * @returns {?external:Settings}
	 */
	// Thanks @kyranet :)
	get(id) {
		const channel = this.client.channels.get(id);
		return channel && channel.type === 'text' ? channel.settings : undefined;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Array<string>|string)} [input=Array<string>] An object containing a id property, like discord.js objects, or a string
	 * @returns {?(MemberGateway|external:Settings)}
	 */
	async sync(input = this.client.channels.reduce((keys, channel) => { if(channel.type === 'text') keys.push(channel.settings.id); return keys; }, [])) {
		if (Array.isArray(input)) {
			if (!this._synced) this._synced = true;
			const entries = await this.provider.getAll(this.type, input);
			for (const entry of entries) {
				if (!entry) continue;

				// Get the entry from the cache
				const cache = this.get(entry.id);
				if (!cache) continue;

				cache._existsInDB = true;
				cache._patch(entry);
			}

			// Set all the remaining settings from unknown status in DB to not exists.
			for (const channel of this.client.channels.values()) {
				if (channel.type === 'text' && channel.settings._existsInDB !== true) channel.settings._existsInDB = false;
			}
			return this;
		}

		const target = getIdentifier(input);
		if (!target) throw new TypeError('The selected target could not be resolved to a string.');

		const cache = this.get(target);
		return cache ? cache.sync() : null;
	}

}

module.exports = TextChannelGateway;
