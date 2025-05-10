import { PaginationException } from './index';

export class PaginationNotFoundException extends PaginationException {
	public constructor() {
		super('Pagination builder not found');
	}
}
