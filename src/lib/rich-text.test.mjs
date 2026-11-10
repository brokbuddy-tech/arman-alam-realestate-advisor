import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRichText, normalizePlainText } from "./rich-text.ts";

test("preserves authored Markdown paragraphs, headings, emphasis and lists", () => {
  const text = "## Property overview\n\nA **bright** family home.\n\n- Two bedrooms\n- Parking\n\n[Contact](https://example.test)";
  assert.equal(normalizeRichText(text), text);
});

test("converts contenteditable HTML wrappers without escaping embedded Markdown", () => {
  const text = normalizeRichText("<div>## Property overview</div><div><br></div><div>A <strong>bright</strong> home.</div><ul><li>Parking</li><li>Pool</li></ul>");
  assert.match(text, /^## Property overview/);
  assert.match(text, /\*\*bright\*\*/);
  assert.match(text, /-\s+Parking/);
  assert.match(text, /-\s+Pool/);
  assert.doesNotMatch(text, /<\/?(?:div|br|strong|ul|li)>/);
});

test("handles escaped and doubly escaped legacy HTML descriptions", () => {
  for (const text of ["&lt;div&gt;## Overview&lt;/div&gt;&lt;div&gt;Family home&lt;/div&gt;", "&amp;lt;div&amp;gt;## Overview&amp;lt;/div&amp;gt;"]) {
    const result = normalizeRichText(text);
    assert.match(result, /^## Overview/);
    assert.doesNotMatch(result, /&(?:amp;)*lt;|<\/?div>/);
  }
});

test("discards executable elements and their contents before sending descriptions to the client", () => {
  const result = normalizeRichText('<div>Safe description</div><script>alert("unsafe")</script><style>body{display:none}</style><iframe src="https://evil.test">unwanted</iframe><img src=x onerror=alert(1)>');
  assert.equal(result, "Safe description");
});

test("keeps plain labels readable without HTML or Markdown markers", () => {
  assert.equal(normalizePlainText("<div><strong>Family Apartment</strong> &amp; Office</div>"), "Family Apartment & Office");
  assert.equal(normalizePlainText("## **Spacious** home"), "Spacious home");
});

test("handles absent descriptions without fabricating content", () => {
  assert.equal(normalizeRichText(null), "");
  assert.equal(normalizeRichText(undefined), "");
  assert.equal(normalizeRichText("  "), "");
});

test("gives common plain-text property section labels a readable heading hierarchy", () => {
  assert.equal(normalizeRichText("PROPERTY OVERVIEW\n\nFamily home.\n\nKEY PROPERTY FEATURES\n\nParking"), "### PROPERTY OVERVIEW\n\nFamily home.\n\n### KEY PROPERTY FEATURES\n\n- Parking");
});

test("formats the screenshot's contenteditable description as readable sections and feature lists", () => {
  const html = 'Apartment for rent in Al Jurf 3, Al Jurf<div><br></div><div>1BHK FAMILY FLAT FOR RENT IN AL JURF 3, AJMAN</div><div><br></div><div>Family Building | Spacious Layout | Comfortable Living | Convenient Location</div><div><br></div><div>Looking for a comfortable home? This apartment offers a practical layout for family living.</div><div><br></div><div>━━━━━━━━━━━━</div><div>PROPERTY HIGHLIGHTS</div><div><br></div><div>1 Bedroom + Hall</div><div>Spacious &amp; Practical Layout</div><div>Family Building</div><div><br></div><div>━━━━━━━━━━━━</div><div>IDEAL FOR FAMILIES</div><div><br></div><div>This family apartment provides practical room arrangements and access to everyday facilities.</div>';
  const text = normalizeRichText(html);
  assert.doesNotMatch(text, /<\/?div>|<br>|&amp;|━/);
  assert.match(text, /### PROPERTY HIGHLIGHTS/);
  assert.match(text, /- 1 Bedroom \+ Hall\n- Spacious & Practical Layout\n- Family Building/);
  assert.match(text, /### IDEAL FOR FAMILIES\n\nThis family apartment/);
  assert.match(text, /\n\n---\n\n/);
});
