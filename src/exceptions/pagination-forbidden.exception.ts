import { PaginationException } from './index';

export class PaginationForbiddenException extends PaginationException {
	public constructor(message?: string) {
		super(message || 'Pagination forbidden');
	}
}
