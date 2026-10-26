// Build-time only: renders one page of the site to HTML so its real text
// (headings, product details, guides) is in the file a crawler downloads,
// not just added later by JavaScript. Bing, link previews and AI search
// tools like ChatGPT and Perplexity don't run JavaScript, so without this
// they saw an empty page. Built by `vite build --ssr` (see package.json) and
// used by scripts/prerender-meta.mjs. Visitors' browsers still build the
// page themselves exactly as before (src/main.jsx).
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Writable } from "node:stream";
import { Site } from "./App.jsx";

// Resolves with { html, jsonLd } once everything — including lazy-loaded
// pages like /tools — has rendered.
export function render(url) {
  const jsonLd = new Map();
  globalThis.__MS_JSONLD__ = jsonLd;
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, cb) { html += chunk.toString(); cb(); },
      final(cb) { globalThis.__MS_JSONLD__ = null; resolve({ html, jsonLd: [...jsonLd] }); cb(); },
    });
    const stream = renderToPipeableStream(
      <StaticRouter location={url}><Site /></StaticRouter>,
      {
        onAllReady() { stream.pipe(sink); },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
