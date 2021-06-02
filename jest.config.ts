import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    roots: ["<rootDir>/src"],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.svg$": "jest-svg-transformer",
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  
  setupFiles: ['./src/setupEnv.ts', "jest-canvas-mock"],
  
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "module_name_(.*)": "<rootDir>/substituted_module_$1.js",
  },
  moduleDirectories: ['node_modules', 'src'],

  // collectCoverage: true,
};
export default config;