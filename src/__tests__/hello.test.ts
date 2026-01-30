import { greet, sayGoodbye } from '../hello';

describe('Hello World Functions', () => {
  describe('greet', () => {
    it('should return a greeting message with the provided name', () => {
      const result = greet('World');
      expect(result).toBe('Hello, World!');
    });

    it('should handle different names correctly', () => {
      expect(greet('Alice')).toBe('Hello, Alice!');
      expect(greet('Bob')).toBe('Hello, Bob!');
    });

    it('should handle empty string', () => {
      expect(greet('')).toBe('Hello, !');
    });

    it('should handle names with special characters', () => {
      expect(greet('José')).toBe('Hello, José!');
      expect(greet('Mary-Jane')).toBe('Hello, Mary-Jane!');
    });
  });

  describe('sayGoodbye', () => {
    it('should return a goodbye message with the provided name', () => {
      const result = sayGoodbye('World');
      expect(result).toBe('Goodbye, World!');
    });

    it('should handle different names correctly', () => {
      expect(sayGoodbye('Alice')).toBe('Goodbye, Alice!');
      expect(sayGoodbye('Bob')).toBe('Goodbye, Bob!');
    });

    it('should handle empty string', () => {
      expect(sayGoodbye('')).toBe('Goodbye, !');
    });

    it('should handle names with special characters', () => {
      expect(sayGoodbye('José')).toBe('Goodbye, José!');
      expect(sayGoodbye('Mary-Jane')).toBe('Goodbye, Mary-Jane!');
    });
  });
});
