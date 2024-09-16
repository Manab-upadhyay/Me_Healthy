export default {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Use Babel for transpiling
  },
  testEnvironment: 'node',
};
