module.exports = {
  presets: [
    'module:@react-native/babel-preset', // React Native preset
    'nativewind/babel', // Tailwind for React Native
    ['@babel/preset-env', { targets: { node: 'current' } }], // Babel preset for node compatibility
  ],
};