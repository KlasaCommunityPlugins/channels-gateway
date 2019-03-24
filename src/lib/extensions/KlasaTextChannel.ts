import { Guild, Structures } from 'discord.js';

module.exports = Structures.extend('TextChannel', (TextChannel) => {
	/**
	 * Klasa's Extended TextChannel
	 * @extends external:TextChannel
	 */
	class KlasaTextChannel extends TextChannel {

		/**
		 * @typedef {external:TextChannelJSON} KlasaTextChannelJSON
		 * @property {external:SettingsJSON} settings The per text channel settings
		 */

		/**
		 * @param {...*} args Normal D.JS TextChannel args
		 */
		constructor(guild: Guild, data?: Object | undefined) {
			super(guild, data);

			/**
			 * The text channel level settings for this context (textchannel || default)
			 * @since 0.0.1
			 * @type {external:Settings}
			 */
			this.settings = this.client.gateways.textchannels.create(this.id);
		}

		/**
		 * Returns the JSON-compatible object of this instance.
		 * @since 0.5.0
		 * @returns {KlasaTextChannelJSON}
		 */
		toJSON() {
			return { ...super.toJSON(), settings: this.settings };
		}

	}

	return KlasaTextChannel;
});
