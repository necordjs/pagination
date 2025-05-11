import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaginationBuilder } from './helpers';
import { NecordPaginationOptions } from './interfaces';
import { MODULE_OPTIONS_TOKEN } from './necord-pagination.module-definition';
import { PaginationAction } from './enums';
import { ButtonStyle } from 'discord.js';
import { PaginationNotFoundException } from './exceptions';

@Injectable()
export class NecordPaginationService {
	private static readonly DEFAULT_OPTIONS: NecordPaginationOptions = {
		allowTraversal: false,
		allowSkip: false,
		buttonsPosition: 'end',
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

	private readonly cache = new Map<string, PaginationBuilder>();

	public constructor(
		@Inject(MODULE_OPTIONS_TOKEN)
		private readonly options: NecordPaginationOptions
	) {
		this.options = this.deepMerge(NecordPaginationService.DEFAULT_OPTIONS, options ?? {});
	}

	/**
	 * Register a new pagination builder
	 * @param factory
	 */
	public register(factory: (builder: PaginationBuilder) => PaginationBuilder): PaginationBuilder {
		const builder = factory(new PaginationBuilder(this.options));

		this.cache.set(builder.customId, builder);

		return builder;
	}

	/**
	 * Alias for register method
	 * @param factory
	 */
	public create(factory: (builder: PaginationBuilder) => PaginationBuilder): PaginationBuilder {
		return this.register(factory);
	}

	public get(customId: string): PaginationBuilder {
		const builder = this.cache.get(customId);

		if (!builder) {
			throw new PaginationNotFoundException();
		}

		return builder;
	}

	public delete(customId: string): boolean {
		return this.cache.delete(customId);
	}

	public copy(customId: string): PaginationBuilder {
		const builder = this.get(customId);

		const copy = builder.copy();

		this.cache.set(copy.customId, copy);

		return copy;
	}

	public clear(): void {
		this.cache.clear();
	}

	private deepMerge<T>(target: T, source: T): T {
		for (const key in source) {
			if (source[key] instanceof Object) {
				Object.assign(source[key], this.deepMerge(target[key], source[key]));
			}
		}

		Object.assign(target || {}, source);

		return target;
	}
}
