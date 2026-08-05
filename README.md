# hacker-house-medellin.github.io

Astro marketing site for **Hacker House Medellín**.

- Built with Astro, not Jekyll.
- Uses GitHub Pages Actions deployment.
- Includes a responsive landing page, SEO metadata, favicon, proof points, workflow, integrations, architecture, and launch CTA.
- `public/.nojekyll` is present only to bypass Jekyll processing on Pages; there is no Jekyll site or `_config.yml`.
- Repository contract metadata lives in `project.json`, `docs/architecture.md`, and `AGENTS.md`.

## Commands

```bash
npm install
npm test
npm run build
python3 scripts/verify_repo.py
```

## Repository family

The site links the public product narrative to `hhm-clients`, `hhm-libs`, `hhm-monorepo`, and `hhm-infra`. GitHub Pages deployment is handled by Actions; Jekyll is not used.
