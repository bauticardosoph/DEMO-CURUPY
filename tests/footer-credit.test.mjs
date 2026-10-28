import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

test("the public footer credits the developer with a safe direct link", () => {
  const clientFile = new URL("../app/site-application.tsx", import.meta.url);
  const source = readFileSync(existsSync(clientFile) ? clientFile : new URL("../app/page.tsx", import.meta.url), "utf8");
  const footer = source.split("\n").find(line => line.startsWith("function Footer("));
  assert.match(footer, /siteFooterBottom/);
  assert.match(footer, /Web desarrollada por /);
  assert.match(footer, /href="https:\/\/bauticardosoph\.com\/" target="_blank" rel="noopener noreferrer">bauticardoso\.ph<\/a>/);
  assert.match(footer, /© 2026 \{content.brand_name\}/);
});

test("the small credit is scoped to the footer and stacks on narrow screens", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /footer>\.siteFooterBottom\{display:flex/);
  assert.match(css, /\.siteFooterBottom \.siteDeveloperCredit\{font-size:11px/);
  assert.match(css, /@media\(max-width:700px\)\{footer>\.siteFooterBottom\{flex-direction:column/);
  assert.match(css, /\.siteDeveloperCredit>a:focus-visible/);
});
