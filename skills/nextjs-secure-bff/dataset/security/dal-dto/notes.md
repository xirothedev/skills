Use a Data Access Layer for privileged reads and writes. It should run only on the server, perform authorization, and return DTOs shaped for the UI instead of raw database records.
