// CORRECT: The processor is retry-safe.
@Process("send-email")
async send(job: Job<EmailJob>) {
  if (await this.outbox.wasProcessed(job.id)) {
    return;
  }

  await this.mailer.send(job.data);
  await this.outbox.markProcessed(job.id);
}
