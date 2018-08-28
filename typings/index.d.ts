declare module 'klasa-member-gateway' {

	import {
		TextChannel,
		Snowflake,
		Collection
	} from 'discord.js';
	import {
		Schema,
		Settings,
		GatewayStorage,
		GatewayDriver,
		GuildResolvable,
		GatewayGetPathOptions,
		GatewayGetPathResult
	} from 'klasa';

	class TextChannelGatewayClient extends Client {
		public static defaultTextChannelSchema: Schema;
	}

	export { TextChannelGatewayClient as Client };

	export class KlasaTextChannel extends TextChannel {
		public settings: Settings;
		public toJSON(): KlasaTextChannelJSON;
	}

	export class TextChannelGateway extends GatewayStorage {
		public get(id: string | [Snowflake, Snowflake]): Settings | null;
		public sync(input: string): Promise<Settings>;
		public sync(input?: string[]): Promise<this>;
	}

	export type KlasaMemberJSON = {
		type: string;
		deleted: boolean;
		id: Snowflake;
		name: string;
		rawPosition: number;
		parentID: Snowflake;
		permissionOverwrites: Snowflake[];
		topic: string;
		nsfw: boolean;
		lastMessageID: Snowflake;
		guild: Snowflake;
		messages: Snowflake[];
		createdTimestamp: number;
		settings: Settings;
	};
}
