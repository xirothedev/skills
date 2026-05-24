// INCORRECT: The connected microservice does not inherit global pipes or guards.
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
});
await app.startAllMicroservices();
