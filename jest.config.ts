import { type JestConfigWithTsJest, createJsWithTsEsmPreset } from "ts-jest";
import type {Config} from 'jest';

const setupAndIgnore = ['<rootDir>/__tests__/singleton.ts', '<rootDir>/__tests__/setup.ts'];

const config: Config = {
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', ...setupAndIgnore],
  setupFilesAfterEnv: setupAndIgnore,
};

const presetConfig = createJsWithTsEsmPreset();

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: "node",
  ...config,
  ...presetConfig,
  preset: 'ts-jest',
}

export default jestConfig;