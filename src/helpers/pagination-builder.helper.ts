import {
	ActionRowBuilder,
	BaseInteraction,
	BaseMessageOptions as PageOptions,
	ButtonBuilder
} from 'discord.js';
import { PageBuilder } from './page-builder.helper';
import { NecordPaginationOptions } from '../interfaces';
import { PaginationAction } from '../enums';
import assert = require('assert');

type PagesFactory = (page: number, maxPages: number) => Promise<PageBuilder> | PageBuilder;
type PagesFilter = (interaction: BaseInteraction) => Promise<boolean> | boolean;

export class PaginationBuilder {
	public customId: string;

	private _maxPages: number;

	public get maxPages(): number {
		if (this.pages.length) {
			return this.pages.length;
		}

		return this._maxPages ?? null;
	}

	public set maxPages(value: number) {
		this._maxPages = value;
	}

	public filters: PagesFilter[] = [];

	private pages: PageBuilder[] = [];

	private pagesFactory: PagesFactory;

	private readonly options: NecordPaginationOptions;

	public constructor(options: NecordPaginationOptions) {
		this.options = { ...options };
	}

	public setCustomId(customId: string): this {
		this.customId = customId;
		return this;
	}

	public setMaxPages(maxPages: number): this {
		this.maxPages = maxPages;
		return this;
	}

	public setPages(pages: PageBuilder[]): this {
		this.pages = pages;
		return this;
	}

	public addPage(page: PageBuilder): this {
		this.pages.push(page);
		return this;
	}

	public clearPages(): this {
		this.pages = [];
		return this;
	}

	public setPagesFactory(factory: PagesFactory): this {
		this.pagesFactory = factory;
		return this;
	}

	public setButtonsAppearance(buttons: NecordPaginationOptions['buttons']): this {
		this.options.buttons = buttons;
		return this;
	}

	public setAllowSkip(allowSkip: boolean): this {
		this.options.allowSkip = allowSkip;
		return this;
	}

	public setAllowTraversal(allowTraversal: boolean): this {
		this.options.allowTraversal = allowTraversal;
		return this;
	}

	public setFilter(filter: PagesFilter): this {
		this.filters = [filter];
		return this;
	}

	public setFilters(filters: PagesFilter[]): this {
		this.filters = filters;
		return this;
	}

	public addFilter(filter: PagesFilter): this {
		this.filters.push(filter);
		return this;
	}

	public clearFilters(): this {
		this.filters = [];
		return this;
	}

	public async filter(interaction: BaseInteraction): Promise<boolean> {
		if (this.filters.length === 0) {
			return true;
		}

		for (const filter of this.filters) {
			if (!(await filter(interaction))) {
				return false;
			}
		}

		return true;
	}

	public async build(page = 1): Promise<PageOptions> {
		page = Math.max(1, Math.min(page, this.maxPages)) || 1;

		assert(!!this.customId, 'Custom id must be set');
		assert(
			!!this.pagesFactory || this.pages.length >= 1,
			'Pages factory must be set if no pages are provided'
		);
		assert(this.maxPages !== null, 'Max pages must be set if no pages are provided');
		assert(this.maxPages >= page, `Page ${page} is out of range (max: ${this.maxPages})`);

		const pageBuilder = this.pages[page - 1] ?? (await this.pagesFactory(page, this.maxPages));
		const pageOptions = pageBuilder.build();
		const buttons = this.generateButtons(page);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
		return {
			...pageOptions,
			components:
				this.options.buttonsPosition === 'end'
					? [...pageOptions.components, row]
					: [row, ...pageOptions.components]
		};
	}

	public copy(): PaginationBuilder {
		const copy = new PaginationBuilder(this.options);
		const customId = [this.customId, 'copy', crypto.randomUUID()].join('.');

		copy.setCustomId(customId);
		copy.setMaxPages(this.maxPages);
		copy.setPages(this.pages);
		copy.setPagesFactory(this.pagesFactory);
		copy.setButtonsAppearance(this.options.buttons);
		copy.setAllowSkip(this.options.allowSkip);
		copy.setAllowTraversal(this.options.allowTraversal);
		copy.setFilters(this.filters);

		return copy;
	}

	private generateButtons(page: number) {
		const options: NecordPaginationOptions = { ...this.options };

		if (!options.allowSkip) {
			delete options.buttons[PaginationAction.First];
			delete options.buttons[PaginationAction.Last];
		}

		if (!options.allowTraversal) {
			delete options.buttons[PaginationAction.Traverse];
		}

		return Object.entries(this.options.buttons).map(([action, button]) => {
			let navigationPage = String(page);
			let disabled = false;

			switch (action) {
				case PaginationAction.First:
					navigationPage = `-1`;

					if (page === 1) {
						disabled = true;
					}

					break;

				case PaginationAction.Next:
					if (page === this.maxPages) {
						disabled = true;
					}
					navigationPage = `${page + 1}`;
					break;
				case PaginationAction.Back:
					if (page === 1) {
						disabled = true;
					}

					navigationPage = `${page - 1}`;
					break;
				case PaginationAction.Last:
					if (page === this.maxPages) {
						disabled = true;
					}
					navigationPage = `${this.maxPages + 2}`;
					break;
				case PaginationAction.Traverse:
					navigationPage = 'traversal';
					break;
			}

			const builder = new ButtonBuilder()
				.setStyle(button.style)
				.setLabel(button.label)
				.setDisabled(disabled)
				.setCustomId(`necord-pagination/${this.customId}/${navigationPage}`);

			if (button.emoji) {
				builder.setEmoji(button.emoji);
			}

			return builder;
		});
	}
}
