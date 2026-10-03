src/pages/index.astro: main had reworked the page (fleet nav / access section / copy) while this PR added the
ORES Chat footer launcher. Kept main's page structure and inserted the PR's two additions where they belong:
the integrity-pinned `<script is:inline type="module" …ores-chat-footer-link.js>` in <head> and the
`<ores-chat-footer-link context-id=…>` element at the end of <footer>. Nothing from either side dropped.
