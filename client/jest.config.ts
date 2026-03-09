import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
};

export default async function config() {
  const styleFileRegex = "^.+\\.(css|sass|scss)$";
  const nextJestConfig = await createJestConfig(customJestConfig)();

  delete nextJestConfig.moduleNameMapper?.[styleFileRegex];

  return {
    ...nextJestConfig,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
      ...nextJestConfig.moduleNameMapper,
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      "\\.css\\.ts$": "@vanilla-extract/jest-transform",
      ...nextJestConfig.transform,
    },
  };
}