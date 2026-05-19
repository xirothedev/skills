// deploy.sh
// bun prisma migrate deploy
// bun prisma generate
// bun dist/main.js

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
