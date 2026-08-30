# hacker-house-medellin.github.io

Astro marketing site for **Hacker House Medellín**.

- Built with Astro, not Jekyll.
- The canonical document is `src/pages/index.astro`; only the tested `dist/` artifact is published.
- Uses GitHub Pages Actions deployment.
- Includes a responsive landing page, SEO metadata, favicon, proof points, workflow, integrations, architecture, and launch CTA.
- Publishes anonymous pre-interest and application forms at `/submit-pre-interest` and `/submit-application`, plus the `/pre-register` pre-interest alias.
- Hands recognized applicants to the server-rendered forms on `user.hhaus.org`; the static marketing origin never reads an authentication cookie or receives a delegated bearer token.
- `public/.nojekyll` is present only to bypass Jekyll processing on Pages; there is no Jekyll site or `_config.yml`.
- Repository contract metadata lives in `project.json`, `docs/architecture.md`, and `AGENTS.md`.

## Intake configuration

The public forms contain no Supabase key and do not write to either database directly. They send contract-validated requests to `api.hhaus.org`; the API owns the atomic primary PostgreSQL write, Supabase mirror/outbox acknowledgement, and private-object verification. Private uploads use a short-lived API-issued signed URL scoped to the exact HHaus Supabase project and are accepted only after the API streams and verifies the object's hash, type, and size.

Astro embeds only these public build values:

- `PUBLIC_HHAUS_API_ORIGIN` — fixed to `https://api.hhaus.org` in CI and Pages.
- `PUBLIC_HHAUS_SUPABASE_ORIGIN` — fixed to the project origin for `bihpugkzayenywfyajnr`.
- `PUBLIC_HHAUS_TURNSTILE_SITE_KEY` — the public widget key, read from the GitHub repository variable `HHAUS_TURNSTILE_SITE_KEY`.

The Pages workflow refuses to deploy when the Turnstile repository variable is absent. The corresponding Turnstile secret is server-only and belongs in the API deployment secret; it must never be added to this repository. Anonymous clients obtain a fresh proof for every protected API request because Turnstile proofs are single-use. Authenticated intake is handled by `user.hhaus.org` with a narrowly delegated Shared Auth token instead.

The production release remains gated on a reviewed intake privacy notice and enforced document-deletion schedule. The form records the accepted notice version (`2026-08-30`), but that does not replace legal/privacy review before collecting photo identification.

## Commands

```bash
npm ci --ignore-scripts
npm test
npm run build
python3 scripts/verify_repo.py
actionlint
```

## Repository family

The site links the public product narrative to `hhm-clients`, `hhm-libs`, `hhm-monorepo`, and `hhm-infra`. GitHub Pages deployment is handled by Actions; Jekyll is not used.
