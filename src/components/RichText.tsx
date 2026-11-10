import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function RichText({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={`rich-text min-w-0 ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]} skipHtml allowedElements={["p", "br", "strong", "em", "del", "a", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "pre", "code", "hr", "table", "thead", "tbody", "tr", "th", "td"]} components={{
        h1: ({ children }) => <h3>{children}</h3>,
        h2: ({ children }) => <h3>{children}</h3>,
        a: ({ href, children }) => href ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> : <span>{children}</span>,
      }}>{content}</Markdown>
    </div>
  );
}
