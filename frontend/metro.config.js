const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add .tflite to asset extensions so they can be imported
config.resolver.assetExts.push('tflite');

module.exports = config;
