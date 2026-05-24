// CORRECT: Structured logs include job and dependency context.
this.logger.error("job failed", {
  jobId: job.id,
  queue: job.queueName,
  cause: error instanceof Error ? error.message : "unknown",
});
