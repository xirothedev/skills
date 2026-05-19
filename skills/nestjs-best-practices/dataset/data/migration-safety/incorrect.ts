async function bootstrap() {
  await execa("bun", ["prisma", "db", "push"]);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
