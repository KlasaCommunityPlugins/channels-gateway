import { GatewayDriverRegisterOptions, KlasaClient, KlasaClientOptions, Schema, Settings, util } from 'klasa';
import { join } from 'path';

import { CategoryChannelGateway } from './settings/CategoryChannelGateway';
import { TextChannelGateway } from './settings/TextChannelGateway';
import { VoiceChannelGateway } from './settings/VoiceChannelGateway';

import { CLIENT } from './util/contants';

KlasaClient.defaultCategoryChannelSchema = new Schema();
KlasaClient.defaultTextChannelSchema = new Schema();
KlasaClient.defaultVoiceChannelSchema = new Schema();

export class ChannelsGatewayClient extends KlasaClient {

  constructor(opt: KlasaClientOptions) {
    super(opt);
    // @ts-ignore
    this.constructor[KlasaClient.plugin].call(this);
  }

  static [KlasaClient.plugin]() {
    const self = this as unknown as ChannelsGatewayClient;
    util.mergeDefault(CLIENT, self.options);

    // Text Channels
    const textChannels = self.options.gateways.textchannels as GatewayDriverRegisterOptions;
    const textChannelSchema = ChannelsGatewayClient.defaultTextChannelSchema;
    const textChannelProvider = (textChannels.provider || self.options.providers.default) as string;

    self.gateways.textchannels = new TextChannelGateway(self.gateways, 'textchannels', textChannelSchema, textChannelProvider);
    self.gateways.keys.add('textchannels');
    // @ts-ignore
    self.gateways._queue.push(self.gateways.textchannels.init.bind(self.gateways.textchannels));

    // Voice Channels
    const voiceChannels = self.options.gateways.voicechannels as GatewayDriverRegisterOptions;
    const voiceChannelSchema = KlasaClient.defaultVoiceChannelSchema;
    const voiceChannelProvider = (voiceChannels.provider || self.options.providers.default) as string;

    self.gateways.voicechannels = new VoiceChannelGateway(self.gateways, 'voicechannels', voiceChannelSchema, voiceChannelProvider);
    self.gateways.keys.add('voicechannels');
    // @ts-ignore
    self.gateways._queue.push(self.gateways.voicechannels.init.bind(self.gateways.voicechannels));

    // Category Channels
    const categoryChannels = self.options.gateways.categorychannels as GatewayDriverRegisterOptions;
    const categoryChannelSchema = KlasaClient.defaultCategoryChannelSchema;
    const categoryChannelProvider = (categoryChannels.provider || self.options.providers.default) as string;

    self.gateways.categorychannels = new CategoryChannelGateway(self.gateways, 'categorychannels', categoryChannelSchema, categoryChannelProvider);
    self.gateways.keys.add('categorychannels');
    // @ts-ignore
    self.gateways._queue.push(self.gateways.categorychannels.init.bind(self.gateways.categorychannels));

    // @ts-ignore
    self.commands.registerCoreDirectory(join(__dirname, '../'));
  }
}

declare module 'klasa' {

  interface GatewayDriver {
    categorychannels: CategoryChannelGateway;
    textchannels: TextChannelGateway;
    voicechannels: VoiceChannelGateway;
  }

  namespace KlasaClient {
    export let defaultCategoryChannelSchema: Schema;
    export let defaultTextChannelSchema: Schema;
    export let defaultVoiceChannelSchema: Schema;
  }
}

declare module 'discord.js' {
  interface Client {
    defaultTextChannelSchema: Schema;
  }
  interface Channel {
    settings: Settings;
  }
}
