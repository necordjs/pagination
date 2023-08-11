import { NestFactory } from '@nestjs/core';
import { Module, Provider } from '@nestjs/common';
import { NecordModule } from 'necord';
import { NecordPaginationModule } from '../src';

export const createApplication = (...providers: Provider[]) => {
	@Module({
		imports: [
			NecordModule.forRoot({
				token: process.env.DISCORD_TOKEN,
				intents: [
					'Guilds',
					'DirectMessages',
					'GuildMembers',
					'GuildMessages',
					'MessageContent'
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
