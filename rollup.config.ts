import typescript from "rollup-plugin-typescript2";
import { RollupOptions } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const config: RollupOptions = {
  input: "packages/useAdjustPanel.ts", // 你的入口文件路径
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [typescript(), resolve(), commonjs()],
  external: ["vue"],
};

export default config;
