import { PaginationException } from './pagination.exception';

export class PaginationNotFoundException extends PaginationException {
	public constructor(message?: string) {
		super(message || 'Pagination builder not found');
	}
}
