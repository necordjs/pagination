import { BaseMessageOptions as PageOptions } from 'discord.js';

type NotReadOnly<T> = {
	-readonly [P in keyof T]: T[P];
};

export class PageBuilder {
	private content: PageOptions['content'] = null;

	private embeds: NotReadOnly<PageOptions['embeds']> = [];

	private files: NotReadOnly<PageOptions['files']> = [];

	private components: PageOptions['components'] = [];

	public setContent(content: PageOptions['content']): this {
		this.content = content;
		return this;
	}

	public setEmbeds(embeds: PageBuilder['embeds']): this {
		this.embeds = embeds;
		return this;
	}

	public addEmbed(embed: PageBuilder['embeds'][0]): this {
		this.embeds.push(embed);
		return this;
	}

	public setFiles(files: PageBuilder['files']): this {
		this.files = files;
		return this;
	}

	public addFile(file: PageBuilder['files'][0]): this {
		this.files.push(file);
		return this;
	}

	public setComponents(components: PageOptions['components']): this {
		this.components = components;
		return this;
	}

	public build(): PageOptions {
		return {
			content: this.content,
			embeds: this.embeds,
			files: this.files,
			components: this.components
		};
	}
}
