// INCORRECT: A retry can send the same email twice.
@Process("send-email")
async send(job: Job<EmailJob>) {
  await this.mailer.send(job.data);
}
