import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';

export default {
  input: 'index.ts',
  output: [
    {
      dir: 'es',
      format: 'es',
      entryFileNames: '[name].js',
    },
    {
      dir: 'cjs',
      format: 'cjs',
      entryFileNames: '[name].js',
    },
    {
      format: 'cjs',
      file: 'cjs/index.min.js',
      plugins: [terser()],
    },
  ],
  plugins: [clear({targets: ['es', 'cjs']}), typescript()],
};
