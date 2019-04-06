// Copyright (c) 2018-2019 KlasaCommunityPlugins. All rights reserved. MIT license.
import { GuildChannel } from 'discord.js';
import { Gateway, Settings } from 'klasa';

export class GuildChannelGateway extends Gateway {
	/**
	 * TODO(Vlad): Remove this code once settings branch is merged
	 */

	private _synced!: boolean;

	// @ts-ignore
	get(id: string, create?: boolean) {
		const channel = this.client.channels.get(id) as GuildChannel;
		if (channel && channel.type === this.type.split('Channel')[0]) return channel.settings!;
		if (create) {
			// @ts-ignore
			const settings: Settings = new (this.Settings as unknown as typeof Settings)(this, { id });
			if (this._synced && this.schema!.size) settings.sync(true).catch((err) => this.client.emit('error', err));
			return settings;
		}
		return null;
	}

	// @ts-ignore
	async sync(input: string | string[] = this.client.channels.reduce((acc, current) => current.type === this.type.split('Channel')[0] ? acc.concat(current.id) : acc, [])) {
		if (Array.isArray(input)) {
			if (!this._synced) this._synced = true;
			const entries = await this.provider!.getAll(this.type);
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

			for (const channel of this.client.channels.values()) {
				// @ts-ignore
				if (channel.type === this.type.split('Channel')[0]) (channel as GuildChannel).settings!._existsInDB = false;
			}
			return this;
		}

		// @ts-ignore
		const cache = this.get((input && input.id) || input);
		return cache ? cache.sync(true) : null;
	}
}
