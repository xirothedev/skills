import { Test } from "@nestjs/testing";

describe("UsersService", () => {
  it("finds a user", async () => {
    const usersRepo = { findOne: jest.fn().mockResolvedValue({ id: "user_1" }) };
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersRepo, useValue: usersRepo }],
    }).compile();
    const service = moduleRef.get(UsersService);
    await expect(service.findOne("user_1")).resolves.toEqual({ id: "user_1" });
  });
});
