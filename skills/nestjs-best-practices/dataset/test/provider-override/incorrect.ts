import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";

describe("UsersService", () => {
  it("finds a user", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const service = moduleRef.get(UsersService);
    await expect(service.findOne("user_1")).resolves.toBeDefined();
  });
});
