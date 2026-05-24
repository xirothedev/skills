// CORRECT: A distributed lock prevents duplicate cron side effects.
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async billCustomers() {
  await this.lock.runOnce("billing:daily", async () => {
    await this.billing.run();
  });
}
