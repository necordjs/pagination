export * from './pagination-forbidden.exception';
export * from './pagination-not-found.exception';

export class PaginationException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PaginationException';
	}
}
