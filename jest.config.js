// jest.config.js
module.exports = {
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', "**/?(*.)+(spec|test).[jt]s?(x)"],
  roots: ['<rootDir>/src'],
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@react-native|react-native|@react-navigation|@realm/react)'  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
