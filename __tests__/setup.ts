import { jest } from "@jest/globals";

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});