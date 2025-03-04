import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { jest } from '@jest/globals';

import prisma from '../dist/src/singletons/db';

if (process.env.NODE_ENV === 'test') {
  prisma.$connect = async () => {
    return Promise.resolve();
  };
}

jest.mock('../dist/src/singletons/db', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>