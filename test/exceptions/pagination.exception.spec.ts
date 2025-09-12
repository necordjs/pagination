import { PaginationException } from '../../src';

class TestPaginationException extends PaginationException {
	constructor(message: string) {
		super(message);
	}
}

describe('PaginationException', () => {
	it('should set the error message', () => {
		const error = new TestPaginationException('Test message');
		expect(error.message).toBe('Test message');
	});

	it('should have the correct name', () => {
		const error = new TestPaginationException('Test message');
		expect(error.name).toBe('TestPaginationException');
	});

	it('should be instance of Error and PaginationException', () => {
		const error = new TestPaginationException('Test message');
		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(PaginationException);
	});
});
