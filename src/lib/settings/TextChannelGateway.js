const { GatewayStorage, Settings, util: { getIdentifier } } = require('klasa');
const { Collection } = require('discord.js');

/**
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
class TextChannelGateway extends GatewayStorage {

	constructor(store, type, schema, provider) {
		super(store.client, type, schema, provider);

		/**
		 * The GatewayDriver that manages this Gateway
		 * @since 0.0.1
		 * @type {external:GatewayDriver}
		 */
		this.store = store;

		/**
		 * The synchronization queue for all Settings instances
		 * @since 0.0.1
		 * @type {external:Collection<string, Promise<external:Settings>>}
		 */
		this.syncQueue = new Collection();

		/**
		 * @since 0.0.1
		 * @type {boolean}
		 * @private
		 */
		Object.defineProperty(this, '_synced', { value: false, writable: true });
	}

	/**
	 * The Settings that this class should make.
	 * @since 0.0.1
	 * @type {external:Settings}
	 * @readonly
	 * @private
	 */
	get Settings() {
		return Settings;
	}

	/**
	 * Get a Settings entry from this gateway
	 * @since 0.0.1
	 * @param {string} id The id for this instance
	 * @returns {?external:Settings}
	 */
	// Thanks @kyranet :)
	get(id) {
		const channel = this.client.channels.get(id);
		return channel && channel.type === 'text' ? channel.settings : undefined;
	}

	/**
	 * Create a new Settings for this gateway
	 * @since 0.0.1
	 * @param {string} id The id for this instance
	 * @param {Object<string, *>} [data={}] The data for this Settings instance
	 * @returns {external:Settings}
	 */
	create(id, data = {}) {
		const entry = this.get(id);
		if (entry) return entry;

		const settings = new this.Settings(this, { id, ...data });
		if (this._synced) settings.sync();
		return settings;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Array<string>|string)} [input=Array<string>] An object containing a id property, like discord.js objects, or a string
	 * @returns {?(TextChannelGateway|external:Settings)}
	 */
	async sync(input = this.client.channels.reduce((channels, channel) => channel.type === 'text' ? channels.concat(channel.id) : channels, [])) {
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
