import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaginationBuilder } from './helpers';
import { NecordPaginationOptions } from './interfaces';
import { MODULE_OPTIONS_TOKEN } from './necord-pagination.module-definition';
import { PaginationAction } from './enums';
import { ButtonStyle } from 'discord.js';

@Injectable()
export class NecordPaginationService {
	private static readonly DEFAULT_OPTIONS: NecordPaginationOptions = {
		allowTraversal: false,
		allowSkip: false,
		buttons: {
			[PaginationAction.First]: {
				label: 'First',
				emoji: '⏮️',
				style: ButtonStyle.Primary
			},
			[PaginationAction.Back]: {
				label: 'Previous',
				emoji: '⏪',
				style: ButtonStyle.Primary
			},
			[PaginationAction.Next]: {
				label: 'Next',
				emoji: '⏩',
				style: ButtonStyle.Primary
			},
			[PaginationAction.Last]: {
				label: 'Last',
				emoji: '⏭️',
				style: ButtonStyle.Primary
			},
			[PaginationAction.Traverse]: {
				label: 'Traverse',
				emoji: '🔢',
				style: ButtonStyle.Primary
			}
		}
	};

	private readonly logger = new Logger(NecordPaginationService.name);

	private readonly cache = new Map<string, PaginationBuilder>();

	public constructor(
		@Inject(MODULE_OPTIONS_TOKEN)
		private readonly options: NecordPaginationOptions
	) {
		this.options = {
			...NecordPaginationService.DEFAULT_OPTIONS,
			...options,
			buttons: {
				...NecordPaginationService.DEFAULT_OPTIONS.buttons,
				...options.buttons
			}
		};
	}

	public register(factory: (builder: PaginationBuilder) => PaginationBuilder): PaginationBuilder {
		const builder = factory(new PaginationBuilder(this.options));

		if (this.cache.has(builder.customId)) {
			this.logger.warn(`Pagination : ${builder.customId} already exists`);
		}

		this.cache.set(builder.customId, builder);

		return builder;
	}

	public get(customId: string): PaginationBuilder {
		if (!this.cache.has(customId)) {
			this.logger.warn(`Pagination : ${customId} doesn't exists`);
		}

		return this.cache.get(customId);
	}

	public delete(customId: string): boolean {
		return this.cache.delete(customId);
	}
}
