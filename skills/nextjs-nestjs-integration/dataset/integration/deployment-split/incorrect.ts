// INCORRECT: The frontend deploy does not verify backend health or client drift.
export async function release() {
  await deployWeb();
}
