import { ButtonStyle } from 'discord.js';
import { PaginationAction } from '../enums';

export interface ButtonAppearance {
	style: Exclude<ButtonStyle, ButtonStyle.Link>;
	label: string;
	emoji: string;
}

export interface ModalAppearance {
	title?: string;
	label?: string;
	placeholder?: string;
}

export type ButtonsAppearance = {
	[key in PaginationAction]?: Partial<ButtonAppearance>;
};

export interface NecordPaginationOptions {
	buttons?: ButtonsAppearance;
	modal?: ModalAppearance;
	allowSkip?: boolean;
	allowTraversal?: boolean;
	buttonsPosition?: 'start' | 'end';
	cache?: {
		/**
		 * Maximum size of the cache, which stores pagination builders.
		 * This is useful to prevent memory leaks in long-running applications.
		 * If the cache is full, the oldest pagination builders will be removed.
		 * Set `Infinity` to disable the cache.
		 * @default Infinity
		 */
		maxSize?: number;
	};
}
