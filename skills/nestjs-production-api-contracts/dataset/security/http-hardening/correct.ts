// CORRECT: Centralized, explicit HTTP policy in bootstrap.
app.enableCors({
  origin: config.allowedOrigins,
  credentials: true,
});
app.use(helmet());
