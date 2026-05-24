// INCORRECT: Telemetry starts during render.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  startTelemetry();
  return <html><body>{children}</body></html>;
}
