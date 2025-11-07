import { interpret } from './interpreter';
import { describe, test, expect, jest } from '@jest/globals';

describe('Interpreter', () => {
  test('should handle variable assignment', () => {
    const code = 'var x = 10; var y = 20;';
    const env = interpret(code);
    expect(env.x).toBe(10);
    expect(env.y).toBe(20);
  });

  test('should handle arithmetic operations', () => {
    const code = 'var a = 10 + 5; var b = 10 - 5; var c = 10 * 5; var d = 10 / 5;';
    const env = interpret(code);
    expect(env.a).toBe(15);
    expect(env.b).toBe(5);
    expect(env.c).toBe(50);
    expect(env.d).toBe(2);
  });

  test('should handle string values', () => {
    const code = 'var name = "Hello"; var message = "World";';
    const env = interpret(code);
    expect(env.name).toBe('Hello');
    expect(env.message).toBe('World');
  });

  test('should handle comparison operations', () => {
    const code = 'var a = 10 == 10; var b = 10 != 5; var c = 10 < 20; var d = 10 > 5;';
    const env = interpret(code);
    expect(env.a).toBe(true);
    expect(env.b).toBe(true);
    expect(env.c).toBe(true);
    expect(env.d).toBe(true);
  });

  test('should handle if-else statements', () => {
    const code = 'var x = 10; var result = 0; if (x > 5) { result = 1; } else { result = 2; }';
    const env = interpret(code);
    expect(env.result).toBe(1);

    const code2 = 'var x = 3; var result = 0; if (x > 5) { result = 1; } else { result = 2; }';
    const env2 = interpret(code2);
    expect(env2.result).toBe(2);
  });

  test('should handle while loops', () => {
    const code = 'var x = 0; var sum = 0; while (x < 5) { sum = sum + x; x = x + 1; }';
    const env = interpret(code);
    expect(env.x).toBe(5);
    expect(env.sum).toBe(10); // 0+1+2+3+4=10
  });

  test('should handle parentheses in expressions', () => {
    const code = 'var a = (10 + 5) * 2; var b = 10 + (5 * 2);';
    const env = interpret(code);
    expect(env.a).toBe(30);
    expect(env.b).toBe(20);
  });

  test('should handle complex expressions', () => {
    const code = 'var x = 10; var y = 20; var z = (x + y) * 2 - 5 / 1;';
    const env = interpret(code);
    expect(env.z).toBe(55); // (10+20)*2 -5 = 60-5=55
  });

  test('should handle print statements', () => {
    // 捕获console.log输出
    const consoleSpy = jest.spyOn(console, 'log');
    const code = 'var x = 10; print(x); print("Hello");';
    interpret(code);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 10);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Hello');
    consoleSpy.mockRestore();
  });

  test('should handle combined statements', () => {
    const code = `
      var count = 0;
      var sum = 0;
      while (count < 3) {
        if (count % 2 == 0) {
          sum = sum + count;
        }
        count = count + 1;
      }
      print(sum);
    `;
    const consoleSpy = jest.spyOn(console, 'log');
    const env = interpret(code);
    expect(env.count).toBe(3);
    expect(env.sum).toBe(2); // 0+2=2
    expect(consoleSpy).toHaveBeenCalledWith(2);
    consoleSpy.mockRestore();
  });
});