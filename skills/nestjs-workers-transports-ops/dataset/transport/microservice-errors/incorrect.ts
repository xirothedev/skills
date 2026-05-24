// INCORRECT: HTTP exceptions do not model RPC failures.
@MessagePattern({ cmd: "charge" })
async charge(data: ChargeMessage) {
  if (!data.accountId) {
    throw new BadRequestException("accountId is required");
  }
  return this.billing.charge(data);
}
