import { createApplication } from './utils.local-spec';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { NecordPaginationService, PageBuilder } from '../src';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
class PaginationLocalSpec implements OnModuleInit {
	public constructor(private readonly paginationService: NecordPaginationService) {}

	public onModuleInit() {
		return this.paginationService.register(builder =>
			builder
				.setCustomId('test')
				.setMaxPages(5)
				.setPagesFactory(async page => new PageBuilder().setContent(`Page ${page}`))
		);
	}

	@SlashCommand({ name: 'pagination', description: 'Test pagination' })
	public async onPagination(@Context() [interaction]: SlashCommandContext) {
		const pagination = this.paginationService.get('test');
		const pageOptions = await pagination.build();

		return interaction.reply({
			...pageOptions,
			flags: ['Ephemeral']
		});
	}
}

createApplication(PaginationLocalSpec);
