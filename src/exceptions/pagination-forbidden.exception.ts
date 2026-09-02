import { PaginationException } from './pagination.exception.js';

export class PaginationForbiddenException extends PaginationException {
	public constructor(message?: string) {
		super(message || 'Pagination forbidden');
	}
}
