import { Injectable } from '@nestjs/common';
import { NecordPaginationService } from './necord-pagination.service';
import {
	Button,
	ButtonContext,
	ComponentParam,
	Context,
	Modal,
	ModalContext,
	ModalParam
} from 'necord';
import { PaginationForbiddenException, PaginationNotFoundException } from './exceptions';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

@Injectable()
export class NecordPaginationController {
	public constructor(private readonly paginationService: NecordPaginationService) {}

	@Button('necord-pagination/:name/traversal')
	public async onTraversal(
		@Context() [interaction]: ButtonContext,
		@ComponentParam('name') name: string
	) {
		const modal = new ModalBuilder()
			.setCustomId(`necord-pagination-modal/${name}`)
			.setTitle('Traversal');

		const pageInput = new TextInputBuilder()
			.setLabel('Page')
			.setCustomId('page')
			.setPlaceholder('Enter page number')
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

		if (!pageBuilder.filter(interaction)) throw new PaginationForbiddenException();

		const pageOptions = await pageBuilder.build(+page);

		return interaction.update(pageOptions);
	}

	@Modal('necord-pagination-modal/:name')
	public async onTraversalModal(@Context() [interaction], @ModalParam('name') name: string) {
		const pageBuilder = this.paginationService.get('test');
		const page = +interaction.fields.getTextInputValue('page');

		if (!pageBuilder) throw new PaginationNotFoundException();

		if (!pageBuilder.filter(interaction)) throw new PaginationForbiddenException();

		const pageOptions = await pageBuilder.build(page);

		return interaction.update(pageOptions);
	}
}
