import { Inject, Injectable } from '@nestjs/common';
import { NecordPaginationService } from './necord-pagination.service';
import { Button, ButtonContext, ComponentParam, Context, Modal, ModalParam } from 'necord';
import { PaginationForbiddenException, PaginationNotFoundException } from './exceptions';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ModalAppearance, NecordPaginationOptions } from './interfaces';
import { MODULE_OPTIONS_TOKEN } from './necord-pagination.module-definition';

@Injectable()
export class NecordPaginationController {
	public constructor(
		private readonly paginationService: NecordPaginationService,
		@Inject(MODULE_OPTIONS_TOKEN)
		private readonly options: NecordPaginationOptions
	) {}

	@Button('necord-pagination/:name/traversal')
	public async onTraversal(
		@Context() [interaction]: ButtonContext,
		@ComponentParam('name') name: string
	) {
		const pageBuilder = this.paginationService.get(name);
		const modalOptions: ModalAppearance = Object.assign(
			{
				title: 'Traversal',
				label: 'Page',
				placeholder: 'Enter page number'
			},
			this.options?.modal ?? {}
		);

		const modal = new ModalBuilder()
			.setCustomId(`necord-pagination-modal/${name}`)
			.setTitle(modalOptions.title);

		if (!pageBuilder) throw new PaginationNotFoundException();

		if (!(await pageBuilder.filter(interaction))) throw new PaginationForbiddenException();

		const pageInput = new TextInputBuilder()
			.setLabel(modalOptions.label)
			.setCustomId('page')
			.setPlaceholder(modalOptions.placeholder)
			.setMinLength(1)
			.setMaxLength(String(pageBuilder.maxPages).length)
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const row = new ActionRowBuilder<TextInputBuilder>().addComponents(pageInput);

		modal.addComponents(row);

		return interaction.showModal(modal);
	}

	@Button('necord-pagination/:name/:page')
	public async onNextPage(
		@Context() [interaction]: ButtonContext,
		@ComponentParam('name') name: string,
		@ComponentParam('page') page: string
	) {
		const pageBuilder = this.paginationService.get(name);

		if (!pageBuilder) throw new PaginationNotFoundException();

		if (!(await pageBuilder.filter(interaction))) throw new PaginationForbiddenException();

		const pageOptions = await pageBuilder.build(+page);

		return interaction.update(pageOptions);
	}

	@Modal('necord-pagination-modal/:name')
	public async onTraversalModal(@Context() [interaction], @ModalParam('name') name: string) {
		const pageBuilder = this.paginationService.get(name);
		const page = +interaction.fields.getTextInputValue('page');

		if (!pageBuilder) throw new PaginationNotFoundException();

		if (!(await pageBuilder.filter(interaction))) throw new PaginationForbiddenException();

		const pageOptions = await pageBuilder.build(page);

		return interaction.update(pageOptions);
	}
}
