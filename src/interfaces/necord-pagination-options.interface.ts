import { ButtonStyle } from 'discord.js';
import { PaginationAction } from '../enums';

export interface ButtonAppearance {
	style: Exclude<ButtonStyle, ButtonStyle.Link>;
	label: string;
	emoji?: string;
}

export type ButtonsAppearance = {
	[key in PaginationAction]?: ButtonAppearance;
};

export interface NecordPaginationOptions {
	buttons?: ButtonsAppearance;
	allowSkip?: boolean;
	allowTraversal?: boolean;
}
