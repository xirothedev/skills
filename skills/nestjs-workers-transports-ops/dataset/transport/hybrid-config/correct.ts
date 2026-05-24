// CORRECT: The microservice inherits the main app's cross-cutting config.
app.connectMicroservice<MicroserviceOptions>(
  {
    transport: Transport.TCP,
  },
  { inheritAppConfig: true },
);
await app.startAllMicroservices();
