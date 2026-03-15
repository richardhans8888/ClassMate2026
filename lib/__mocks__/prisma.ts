// lib/__mocks__/prisma.ts

const modelMethods = () => ({
  findMany: jest.fn(),
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
})

export const prisma = {
  user: modelMethods(),
  userProfile: modelMethods(),
  tutor: modelMethods(),
  tutorReview: modelMethods(),
  booking: modelMethods(),
  studyGroup: modelMethods(),
  studyGroupMember: modelMethods(),
  chatSession: modelMethods(),
  chatMessage: modelMethods(),
  pointTransaction: modelMethods(),
  forumPost: modelMethods(),
  studyMaterial: modelMethods(),
  $transaction: jest.fn(),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}
