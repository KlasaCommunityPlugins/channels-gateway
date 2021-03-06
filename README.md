<div>
	<br/>
	<p>
	  <a href="https://www.npmjs.com/package/@kcp/channels-gateway"><img src="https://img.shields.io/npm/v/@kcp/channels-gateway.svg?maxAge=3600" alt="NPM version" /></a>
		<a href="https://www.npmjs.com/package/@kcp/channels-gateway"><img src="https://img.shields.io/npm/dt/@kcp/channels-gateway.svg?maxAge=3600" alt="NPM downloads" /></a>
		<a href="https://packagephobia.now.sh/result?p=@kcp/channels-gateway"><img src="https://packagephobia.now.sh/badge?p=@kcp/channels-gateway" alt="Install Size"></a>
    <a href="https://dev.azure.com/klasacommunityplugins/Plugins/_build/latest?definitionId=8&branchName=master"><img src="https://dev.azure.com/klasacommunityplugins/Plugins/_apis/build/status/Channel%20Gateways?branchName=master" alt="Build Status"></a>
	</p>
	<p>
    <a href="https://nodei.co/npm/@kcp/channels-gateway"><img src="https://nodei.co/npm/@kcp/channels-gateway.png?downloads=true&stars=true" alt="NPM info"></a>
  </p>
</div>

# Channel Gateways

A simple Klasa plugin which adds settings to all your channels

## How To Use

1. Install the plugin.

```bash
npm i @kcp/channels-gateway

# If you use yarn
yarn add @kcp/channels-gateway
```

1. Use `@kcp/channels-gateway` in your client.

```js
const { Client } = require("klasa");
Client.use(require("@kcp/channels-gateway"));

new Client({ channelGateways: { text: true, category: false } }).login("Your Beautiful Token");
```

If you use TypeScript

```ts
import { Client } from 'klasa';
import { Client as ChannelsGatewayClient } from '@kcp/channels-gateway';

Client.use(ChannelsGatewayClient);

new Client({ channelGateways: { text: true, category: false } }).login("Your Beautiful Token");
```

1. ???... Enjoy!

## Tips

- By default, all gateways are enabled. If you want to disable any of them, make sure you specify the client option
- You can disable and enable gateways at any point in time with 0 data loss

## License

This project is under the [MIT](https://github.com/KlasaCommunityPlugins/channels-gateway/blob/master/LICENSE) license.
