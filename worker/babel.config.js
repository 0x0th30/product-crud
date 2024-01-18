module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
    'minify',
  ],
  plugins: [
    'tsconfig-paths-module-resolver',
  ],
  ignore: [
    '**/*.spec.ts',
  ],
};