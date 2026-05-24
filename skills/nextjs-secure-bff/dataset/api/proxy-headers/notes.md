In Proxy, `request: { headers }` changes what the app receives, while response headers are visible to clients. Do not forward all incoming headers or leak cookies, tokens, or internal metadata.
