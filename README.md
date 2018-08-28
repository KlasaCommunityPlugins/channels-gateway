# klasa-textchannel-gateway

Simple plugin to manage an efficient per-member settings gateway.

## Installation

```bash
# NPM
$ npm install --save 1Conan/klasa-textchannel-gateway

# Yarn
$ yarn add 1Conan/klasa-textchannel-gateway
```

## Setup

```js
const { Client } = require('klasa');

Client.use(require('klasa-textchannel-gateway'));

// Modifying the Schema
Client.defaultTextChannelSchema
    .add('disabledCommands', 'command')
```
