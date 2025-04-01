// Type declarations for Jest in TypeScript
import '@jest/globals';
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> extends Function {
      new (...args: Y): T;
      (...args: Y): T;
      mockImplementation(fn?: (...args: Y) => T): this;
      mockImplementationOnce(fn?: (...args: Y) => T): this;
      mockReturnValue(val: T): this;
      mockReturnValueOnce(val: T): this;
      mockResolvedValue(val: T): this;
      mockResolvedValueOnce(val: T): this;
      mockRejectedValue(err: Error | any): this;
      mockRejectedValueOnce(err: Error | any): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
      mockName(name: string): this;
      getMockName(): string;
      mock: {
        calls: Y[];
        instances: T[];
        invocationCallOrder: number[];
        results: Array<{ isThrow: boolean; value: any }>;
      };
    }
  }
}

// Extend the window interface to add HTMLImageElement methods needed for tests
interface HTMLElement {
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
} 