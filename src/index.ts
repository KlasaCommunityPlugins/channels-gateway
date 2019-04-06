// Copyright (c) 2018-2019 KlasaCommunityPlugins. All rights reserved. MIT license.
import { Client as KlasaClient } from 'klasa';

import { ChannelGatewaysClient as Client } from './lib/Client';
export { Client };
export { ChannelGatewaysCategoryChannel } from './lib/extensions/ChannelGatewaysCategoryChannel';
export { ChannelGatewaysTextChannel } from './lib/extensions/ChannelGatewaysTextChannel';
export { ChannelGatewaysVoiceChannel } from './lib/extensions/ChannelGatewaysVoiceChannel';
// @ts-ignore
exports[KlasaClient.plugin] = Client[KlasaClient.plugin];

/**
 * @external KlasaClient
 * @see {@link https://klasa.js.org/#/docs/klasa/master/class/KlasaClient}
 */

/**
 * @external KlasaClientOptions
 * @see {@link https://klasa.js.org/#/docs/klasa/master/typedef/KlasaClientOptions}
 */

/**
 * @external SettingsJSON
 * @see {@link https://klasa.js.org/#/docs/klasa/master/typedef/SettingsJSON}
 */
