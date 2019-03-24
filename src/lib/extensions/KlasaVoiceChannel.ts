import { Guild, Structures } from 'discord.js';

module.exports = Structures.extend('VoiceChannel', (VoiceChannel) => {
	/**
	 * Klasa's Extended VoiceChannel
	 * @extends external:VoiceChannel
	 */
	class KlasaVoiceChannel extends VoiceChannel {

		/**
		 * @typedef {external:VoiceChannelJSON} KlasaVoiceChannelJSON
		 * @property {external:SettingsJSON} settings The per voice channel settings
		 */

		/**
		 * @param {...*} args Normal D.JS VoiceChannel args
		 */
		constructor(guild: Guild, data?: Object | undefined) {
			super(guild, data);

			/**
			 * The voice channel level settings for this context (voicechannel || default)
			 * @since 0.0.1
			 * @type {external:Settings}
			 */
			this.settings = this.client.gateways.voicechannels.create(this.id);
		}

		/**
		 * Returns the JSON-compatible object of this instance.
		 * @since 0.5.0
		 * @returns {KlasaVoiceChannelJSON}
		 */
		toJSON() {
			return { ...super.toJSON(), settings: this.settings };
		}

	}

	return KlasaVoiceChannel;
});
