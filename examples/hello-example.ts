import { greet, sayGoodbye } from '../src/hello';

// Example usage of the hello world functions
console.log(greet('World'));
console.log(greet('TypeScript'));
console.log(sayGoodbye('World'));
console.log(sayGoodbye('TypeScript'));

// Example with user input simulation
const names = ['Alice', 'Bob', 'Charlie'];
names.forEach(name => {
  console.log(greet(name));
  console.log(sayGoodbye(name));
  console.log('---');
});
