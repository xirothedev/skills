// INCORRECT: Credentialed wildcard CORS is too broad.
app.enableCors({
  origin: true,
  credentials: true,
});
