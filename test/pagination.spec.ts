import { createApplication } from './utils.spec';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { NecordPaginationService, PageBuilder } from '../src';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
class PaginationSpec implements OnModuleInit {
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

		return interaction.reply({ ...(await pagination.build()), ephemeral: true });
	}
}

createApplication(PaginationSpec);
