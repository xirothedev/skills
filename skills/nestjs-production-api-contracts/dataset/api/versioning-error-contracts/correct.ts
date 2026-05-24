// CORRECT: Public errors use a stable, documented envelope.
throw new BadRequestException({
  code: "INVALID_REQUEST",
  message: "Invalid request",
});
