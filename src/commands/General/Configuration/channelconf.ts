import { Command, CommandStore, KlasaClient, KlasaMessage, util } from 'klasa';

module.exports = class extends Command {

	constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
		super(client, store, file, dir, {
      description: 'Define per-textchannel settings',
      guarded: true,
      permissionLevel: 6,
      runIn: ['text'],
			subcommands: true,
			usage: '<set|show|remove|reset> (key:key) (value:value) [...]',
			usageDelim: ' ',
		});

		this
			.createCustomResolver('key', (arg, possible, message, [action]) => {
				if (action === 'show' || arg) return arg;
				throw message.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, message, [action]) => {
				if (!['set', 'remove'].includes(action) || arg) return arg;
				throw message.language.get('COMMAND_CONF_NOVALUE');
			});
	}

  show(message: KlasaMessage, [key]: [string]) {
		const path = this.client.gateways.textchannels.getPath(key, {
			avoidUnconfigurable: true,
			errors: false,
			piece: undefined,
		});
		if (!path) return message.sendLocale('COMMAND_CONF_GET_NOEXT', [key]);
		if (!path.piece.path || path.piece.type === 'Folder') {
			return message.sendLocale('COMMAND_CONF_SERVER', [
        key ? `: ${key.split('.').map(util.toTitleCase).join('/')}` : '',
        // @ts-ignore Too lazy to fix this.
				util.codeBlock('asciidoc', message.channel.settings.list(message, path.piece)),
			]);
		}
		return message.sendLocale('COMMAND_CONF_GET', [path.piece.path, message.channel.settings.resolveString(message, path.piece)]);
	}

	async set(message: KlasaMessage, [key, ...valueToSet]: [string, any]) {
		const { errors, updated } = await message.channel.settings.update(key, valueToSet.join(' '), message.guild, { avoidUnconfigurable: true, action: 'add' });
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendLocale('COMMAND_CONF_NOCHANGE', [key]);
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.channel.settings.resolveString(message, updated[0].piece)]);
	}

	async remove(message: KlasaMessage, [key, ...valueToRemove]: [string, any]) {
		const { errors, updated } = await message.channel.settings.update(key, valueToRemove.join(' '), message.guild, { avoidUnconfigurable: true, action: 'remove' });
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendLocale('COMMAND_CONF_NOCHANGE', [key]);
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.channel.settings.resolveString(message, updated[0].piece)]);
	}

	async reset(message: KlasaMessage, [key]: [string]) {
		const { errors, updated } = await message.channel.settings.reset(key, message.guild, { force: true });
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendLocale('COMMAND_CONF_NOCHANGE', [key]);
		return message.sendLocale('COMMAND_CONF_RESET', [key, message.channel.settings.resolveString(message, updated[0].piece)]);
	}

};
