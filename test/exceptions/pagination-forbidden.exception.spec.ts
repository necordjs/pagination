import { PaginationException, PaginationForbiddenException } from '../../src';

describe('PaginationForbiddenException', () => {
	it('should use default message when none is provided', () => {
		const error = new PaginationForbiddenException();
		expect(error.message).toBe('Pagination forbidden');
	});

	it('should use provided message when passed', () => {
		const error = new PaginationForbiddenException('Custom message');
		expect(error.message).toBe('Custom message');
	});

	it('should have correct name', () => {
		const error = new PaginationForbiddenException();
		expect(error.name).toBe('PaginationForbiddenException');
	});

	it('should be instance of Error and PaginationException', () => {
		const error = new PaginationForbiddenException();
		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(PaginationException);
	});
});
