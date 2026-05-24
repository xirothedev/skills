// CORRECT: Trust the known proxy and customize tracker/storage as needed.
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set("trust proxy", "loopback");

ThrottlerModule.forRootAsync({
  useFactory: () => [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
});
