// server/jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest', // translator for jest
  testEnvironment: 'node', // testing backend
  clearMocks: true, // automatical clear mock
};