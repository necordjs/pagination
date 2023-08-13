import { NestFactory } from '@nestjs/core';
import { Module, Provider } from '@nestjs/common';
import { IntentsBitField } from "discord.js";
import { NecordModule } from 'necord';
import { NecordPaginationModule } from '../src';

export const createApplication = (...providers: Provider[]) => {
	@Module({
		imports: [
			NecordModule.forRoot({
				token: process.env.DISCORD_TOKEN,
				intents: [
					IntentsBitField.Flags.Guilds,
					IntentsBitField.Flags.DirectMessages,
					IntentsBitField.Flags.GuildMembers,
					IntentsBitField.Flags.GuildMessages,
					IntentsBitField.Flags.MessageContent
				],
				prefix: '!'
			}),
			NecordPaginationModule.forRoot({
				allowSkip: true,
				allowTraversal: true
			})
		],
		providers
	})
	class AppModule {}

	return NestFactory.createApplicationContext(AppModule);
};
