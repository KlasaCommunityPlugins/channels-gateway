import { KlasaClient } from 'klasa';
import { ChannelsGatewayClient } from './lib/Client';

export default {
  // @ts-ignore
  [KlasaClient.plugin]: ChannelsGatewayClient[KlasaClient.plugin],
};
