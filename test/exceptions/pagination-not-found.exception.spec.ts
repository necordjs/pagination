import { PaginationException, PaginationNotFoundException } from '../../src';

describe('PaginationNotFoundException', () => {
	it('should use default message when none is provided', () => {
		const error = new PaginationNotFoundException();
		expect(error.message).toBe('Pagination builder not found');
	});

	it('should use provided message when passed', () => {
		const error = new PaginationNotFoundException('Custom not found message');
		expect(error.message).toBe('Custom not found message');
	});

	it('should have correct name', () => {
		const error = new PaginationNotFoundException();
		expect(error.name).toBe('PaginationNotFoundException');
	});

	it('should be instance of Error and PaginationException', () => {
		const error = new PaginationNotFoundException();
		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(PaginationException);
	});
});
