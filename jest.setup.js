// jest.setup.js

// Import the React Native testing library for jest-native matchers
import '@testing-library/jest-native/extend-expect';

// Mocking global APIs if necessary (e.g., for Date, Platform, etc.)
global.Date = Date;
global.setTimeout = setTimeout;
global.setInterval = setInterval;
jest.mock('realm');
jest.mock('@realm/react');
// Setup for the react-native-platform mock (if needed)
jest.mock('react-native', () => {
  const realRN = jest.requireActual('react-native');
  return {
    ...realRN,
    Platform: { OS: 'android' }, // Mock platform (for example, 'android')
    Appearance: {
      getColorScheme: jest.fn(() => 'light'), // Mock appearance for dark/light mode
    },
  };
});

// Example of adding mock timers for tests (optional)
jest.useFakeTimers();

// Optional: Mock other libraries that may not work in Node.js environment (if needed)
jest.mock('react-native-css-interop', () => ({
  ...jest.requireActual('react-native-css-interop'),
}));

// Reset any mocks or setup states (optional)
beforeEach(() => {
  jest.clearAllMocks();
});
