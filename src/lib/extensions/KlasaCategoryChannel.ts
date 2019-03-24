import { Guild, Structures } from 'discord.js';

module.exports = Structures.extend('CategoryChannel', (CategoryChannel) => {
	/**
	 * Klasa's Extended CategoryChannel
	 * @extends external:CategoryChannel
	 */
	class KlasaCategoryChannel extends CategoryChannel {

		/**
		 * @typedef {external:CategoryChannelJSON} KlasaCategoryChannelJSON
		 * @property {external:SettingsJSON} settings The per category channel settings
		 */

		/**
		 * @param {...*} args Normal D.JS CategoryChannel args
		 */
		constructor(guild: Guild, data?: Object | undefined) {
			super(guild, data);

			/**
			 * The category channel level settings for this context (categorychannel || default)
			 * @since 0.0.1
			 * @type {external:Settings}
			 */
			this.settings = this.client.gateways.categorychannels.create(this.id);
		}

		/**
		 * Returns the JSON-compatible object of this instance.
		 * @since 0.5.0
		 * @returns {KlasaCategoryChannelJSON}
		 */
		toJSON() {
			return { ...super.toJSON(), settings: this.settings };
		}

	}

	return KlasaCategoryChannel;
});
