# Brontie Partner API

Partners call this API to issue a Brontie voucher. We return a redemption link. The partner surfaces that link inside their own product. Brontie does not contact the recipient: no email, no SMS. The recipient chooses a partner cafe themselves after receiving the link, not at issue time, so no cafe is associated with a voucher until the recipient picks one. Money comes off a balance topped up in advance. There is no refund path back to the balance, including for vouchers that are never redeemed. Self-service top-up is still being built. Until it ships, balances are credited by arrangement with Brontie. Scope: Republic of Ireland, EUR only. Read the Idempotency section before building. The `idempotencyKey` is required and the retry behaviour around it is the only surprising part of this API.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 2 entities and 2 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### [Balance](docs/api/balance.html)

Results: Current balance.

SDK operations: `load`.

Key fields to recognise:

- `alertAt`: The threshold resolved to a euro figure: `lastTopUp × alertPercent`. `null` until the first top-up has been made, because before then there is nothing for the percentage to be a percentage of.
- `alertPercent`: Percentage of the most recent top-up at which the low-balance threshold sits. Always present; defaults to 20.

### [Voucher](docs/api/voucher.html)

Results: Idempotent replay. The original voucher for this key, not charged again. # VERIFIED: balanceAfter on a replay is the balance NOW, not the # balance after the original debit. Note that `balanceAfter` in a replay is your balance at the time of the replay, not the balance recorded when the voucher was first issued. If other vouchers have been issued since, it will differ from the 201 you originally received.; Voucher issued and balance debited.

SDK operations: `create`.

Key fields to recognise:

- `idempotencyKey`: Unique per gift on the partner side, scoped per partner and per mode.
- `message`: Short personal note shown with the gift.
- `product`: `coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00. Prices are fixed per product, not negotiated per partner.
- `reference`: Always present. Your `reference` echoed back unchanged, or an empty string if you did not supply one.
- `senderName`: Who the gift appears to be from, per call, so it can vary by course or cohort.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| [Balance](docs/api/balance.html) | `load` | `GET /api/v1/balance` | Required |
| [Voucher](docs/api/voucher.html) | `create` | `POST /api/v1/vouchers` | Required |

## Connect to the API

- Production. Key prefix determines live or test mode.: `https://www.brontie.ie`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

API key as a bearer token. The key prefix determines the mode: `brontie_test_` for sandbox, `brontie_live_` for production. A key is shown once and cannot be recovered.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| [Golang](docs/sdks/go.html) | `go/` | Build from source |
| [Lua](docs/sdks/lua.html) | `lua/` | Build from source |
| [PHP](docs/sdks/php.html) | `php/` | Build from source |
| [Python](docs/sdks/py.html) | `py/` | Build from source |
| [Ruby](docs/sdks/rb.html) | `rb/` | Build from source |
| [TypeScript](docs/sdks/ts.html) | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### [Go CLI](docs/tools/go-cli.html)

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### [Go MCP server](docs/tools/go-mcp.html)

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `brontie_list`: List records for an entity. No active entity supports this operation.
- `brontie_load`: Load one record for an entity. Supported entities: `balance`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- [`debug`](docs/features/debug.html): Request/response capture ring buffer for debugging
- [`idempotency`](docs/features/idempotency.html): Idempotency keys for safe retries of mutating operations
- [`metrics`](docs/features/metrics.html): Statistics capture: per-operation counters and latency
- [`paging`](docs/features/paging.html): Pagination signals for list operations
- [`ratelimit`](docs/features/ratelimit.html): Client-side rate limiting via a token bucket
- [`retry`](docs/features/retry.html): Automatic retry of transient failures with exponential backoff
- [`test`](docs/features/test.html): In-memory mock transport for testing without a live server
- [`timeout`](docs/features/timeout.html): Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the [first-call guide](docs/guides/first-call.html) for the setup sequence.
- Read the [authentication guide](docs/guides/authentication.html) before using protected routes.
- Use the [API reference](docs/api/index.html) for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

