// CORRECT: Message handlers use transport-aware exceptions.
@MessagePattern({ cmd: "charge" })
async charge(data: ChargeMessage) {
  if (!data.accountId) {
    throw new RpcException({ code: "INVALID_PAYLOAD" });
  }
  return this.billing.charge(data);
}
