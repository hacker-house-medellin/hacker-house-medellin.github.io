import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const english = readFileSync("src/pages/index.astro", "utf8");
const spanish = readFileSync("src/pages/es/index.astro", "utf8");

test("Spanish page has locale, canonical, and accessible navigation", () => {
  assert.match(spanish, /<html lang="es-CO">/);
  assert.match(spanish, /<link rel="canonical" href="https:\/\/hacker-house-medellin\.github\.io\/es\/"\s*\/>/);
  assert.match(spanish, /<nav aria-label="Navegación principal">/);
  assert.match(spanish, /<h1 id="titulo">/);
  assert.match(spanish, /href="\/" hreflang="en" lang="en"/);
});
test("English site links to the Spanish entry point", () => {
  assert.match(english, /rel="alternate" hreflang="es-CO"/);
  assert.match(english, /href="\/es\/" hreflang="es-CO"/);
});
test("Spanish contact actions stay on existing canonical intake endpoints", () => {
  assert.match(spanish, /https:\/\/hhaus\.org\/submit-pre-interest\//);
  assert.match(spanish, /https:\/\/hhaus\.org\/submit-application\//);
  assert.doesNotMatch(spanish, /<form\b/i);
});
