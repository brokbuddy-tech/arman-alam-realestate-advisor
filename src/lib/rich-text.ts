import "server-only";
import TurndownService from "turndown";

const converter = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
// Descriptions often combine Markdown with contenteditable <div>/<br> wrappers.
// Keep the authored Markdown markers while converting those HTML wrappers.
converter.escape = (text) => text;
const discardedElements = new Set(["script", "style", "iframe", "object", "embed", "form", "input", "button", "svg", "math", "img", "link", "meta"]);
converter.addRule("discardUnsafeElements", {
  filter: (node) => discardedElements.has(node.nodeName.toLowerCase()),
  replacement: () => "",
});

const hasHtml = /<\/?[a-z][a-z\d:-]*\b[^>]*>/i;
const hasEncodedHtml = /&(?:amp;)*lt;\/?[a-z][a-z\d:-]*(?:\s|&(?:amp;)*gt;)/i;

function formatDescriptionSections(text: string): string {
  const sections = text.replace(/^[ \t]*[━─—_=-]{3,}[ \t]*$/gm, "---").split(/\n(?:[ \t]*\n)+/);
  let features = false;
  const output: string[] = [];
  for (let section of sections) {
    const line = section.trim();
    if (!line) continue;
    const upperHeading = /^[A-Z\d][A-Z\d &/(),:–—'\-]{2,79}$/.test(line) &&
      ((line.match(/\b[A-Z]{2,}\b/g)?.length ?? 0) >= 2 || /^(AMENITIES|FEATURES|LOCATION|OVERVIEW)$/.test(line));
    if (upperHeading) section = `### ${line}`;
    if (/^#{1,6}\s/.test(section)) {
      features = /\b(?:highlights|features|amenities)\b/i.test(section);
    } else if (section === "---") {
      features = false;
    } else if (features && line.length > 0 && line.length <= 140 && !line.includes("\n") && !/^[-*+]\s|^\d+[.)]\s/.test(line)) {
      section = `- ${line}`;
    } else if (features && line.length > 140) {
      features = false;
    }
    output.push(section);
  }
  return output.join("\n\n").replace(/(- [^\n]+)\n\n(?=- )/g, "$1\n");
}

export function normalizeRichText(value: string | null | undefined): string {
  let text = value?.replace(/\r\n?/g, "\n").trim() ?? "";
  // Decode legacy escaped HTML in bounded passes. The renderer never allows raw HTML.
  for (let pass = 0; pass < 4 && (hasHtml.test(text) || hasEncodedHtml.test(text)); pass++) {
    text = converter.turndown(text).trim();
  }
  return formatDescriptionSections(text);
}

export function normalizePlainText(value: string): string {
  return normalizeRichText(value)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
