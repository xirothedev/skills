// INCORRECT: Default tracker can collapse all clients behind a proxy.
ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 10,
  },
]);
