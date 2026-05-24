// CORRECT: Production cache uses an external store.
CacheModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    stores: [createKeyv(config.getOrThrow("REDIS_URL"))],
  }),
});
