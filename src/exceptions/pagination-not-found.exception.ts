import { PaginationException } from './pagination.exception.js';

export class PaginationNotFoundException extends PaginationException {
	public constructor(message?: string) {
		super(message || 'Pagination builder not found');
	}
}
