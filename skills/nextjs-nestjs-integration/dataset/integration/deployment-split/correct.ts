// CORRECT: Release checks verify backend and generated client compatibility.
export async function release() {
  await verifyApiHealth();
  await verifyOpenApiClientIsCurrent();
  await deployWeb();
}
