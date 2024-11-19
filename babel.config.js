module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // plugins: ["expo-router/babel"], # deleted due to deprication.
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
