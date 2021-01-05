import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const extensions = ['ts','tsx'];

export default {
  input: './dist/index.js',
  plugins: [
    peerDepsExternal(),
    resolve({ extensions }),
  ],
  output: [
    {
      file: pkg.module, // 번들링한 파일을 저장 할 경로
      format: 'es' // ES Module 형태로 번들링함
    }
  ]
};