# Architecture

Marketing, documentation, privacy, support, and public community guidance for Hacker House Medellin.

## Fleet

- `hhm-interfaces`
- `hhm-api`
- `hhm-mash-web`
- `hhm-leptos-web`
- `hhm-dioxus-web`
- `hhm-sync`
- `hhm-cli`
- `hhm-infra`
- `hacker-house-medellin-clients`
- `hacker-house-medellin-libs`
- `hacker-house-medellin.github.io`
- `hacker-house-medellin-monorepo`

Interfaces own wire formats; libraries own reusable domain behavior; clients consume versioned contracts; runtimes own deployment behavior; monorepos coordinate pinned revisions. Edge code is allowlisted and never a generic proxy.

## Intake trust boundaries

The marketing site is a static, unauthenticated client. It never receives database credentials, Supabase service credentials, an HHaus session cookie, or a delegated access token. Public intake is protected by a fresh Cloudflare Turnstile proof for each state-changing API request.

```text
hhaus.org public form
  -> api.hhaus.org contract validation and Turnstile verification
      -> primary PostgreSQL transaction
      -> Supabase mirror plus durable retry/outbox state

private document upload
  -> API issues exact-project, exact-object signed URL
  -> browser uploads to private Supabase bucket
  -> API streams object and verifies hash, type, size, and ownership
  -> application may reference only a verified upload receipt
```

The static origin cannot safely infer a host-only `user.hhaus.org` session. Its sign-in links therefore transfer the user to the server-rendered equivalent route. The user web server performs same-origin Shared Auth delegation, pre-fills only the authenticated subject's profile, and does not expose delegated tokens to browser JavaScript.

Dual storage means the primary database is authoritative and a Supabase copy is part of submission acceptance. A durable outbox records retryable mirror work; clients receive a successful receipt only according to the API's explicit dual-write contract. The API, not this static site, owns idempotency, authorization, object verification, audit correlation, and response redaction.
