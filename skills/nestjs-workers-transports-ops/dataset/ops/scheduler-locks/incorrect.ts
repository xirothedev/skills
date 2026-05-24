// INCORRECT: Every app replica will run this cron.
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async billCustomers() {
  await this.billing.run();
}
