import { Collection } from 'discord.js';
import { GatewayDriver, GatewayStorage, Provider, Schema, Settings } from 'klasa';

/**
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
export class TextChannelGateway extends GatewayStorage {

  store: GatewayDriver;
	syncQueue: Collection<string, Promise<Settings>>;

	private _synced: boolean;

  constructor(store: GatewayDriver, type: string, schema: Schema, provider: string) {
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
		this._synced = false;
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
	get(id: string) {
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
	create(id: string, data: any = {}) {
		const entry = this.get(id);
		if (entry) return entry;

		// @ts-ignore
		const settings = new this.Settings(this, { id, ...data });
		if (this._synced) settings.sync(); // tslint:disable-line:no-floating-promises
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
			const entries = await (this.provider as Provider).getAll(this.type);
			for (const entry of entries) {
				if (!entry) continue;

				// Get the entry from the cache
				const settings = this.get(entry.id);
				if (!settings) continue;

				// @ts-ignore
				if (!settings._existsInDB) settings._existsInDB = true;
				// @ts-ignore
				settings._patch(entry);
			}

			// Set all the remaining settings from unknown status in DB to not exists.
			for (const channel of this.client.channels.values()) {
				// @ts-ignore
				if (channel.type === 'text' && !channel.settings._existsInDB) channel.settings._existsInDB = false;
			}
			return this;
		}

		const cache = this.get((input && input.id) || input);
		return cache ? cache.sync() : null;
	}
}
