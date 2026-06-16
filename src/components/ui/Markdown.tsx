import { Fragment, type ReactNode } from 'react';

/**
 * A tiny, dependency-free Markdown renderer for assistant replies.
 *
 * It supports the subset Gemini commonly produces — headings, bold, italic,
 * inline code, and bullet / numbered lists — and builds React nodes directly
 * (never `dangerouslySetInnerHTML`), so it is safe against injection.
 */
export function Markdown({ content }: { content: string }) {
  return <div className="space-y-2 leading-relaxed">{renderBlocks(content)}</div>;
}

function renderBlocks(text: string): ReactNode[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, i) => (
      <li key={i} className="ml-1">
        {renderInline(item)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={key++} className="list-decimal space-y-1 pl-5">
          {items}
        </ol>
      ) : (
        <ul key={key++} className="list-disc space-y-1 pl-5">
          {items}
        </ul>
      )
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    const heading = line.match(/^(#{1,3})\s+(.*)$/);

    if (heading) {
      flushList();
      const level = heading[1].length;
      const cls = level === 1 ? 'text-base font-bold' : 'text-sm font-bold';
      blocks.push(
        <p key={key++} className={`${cls} text-gray-900 dark:text-white`}>
          {renderInline(heading[2])}
        </p>
      );
    } else if (bullet) {
      if (!list || list.ordered) flushList();
      list = list ?? { ordered: false, items: [] };
      list.items.push(bullet[1]);
    } else if (numbered) {
      if (!list || !list.ordered) flushList();
      list = list ?? { ordered: true, items: [] };
      list.items.push(numbered[1]);
    } else {
      flushList();
      blocks.push(<p key={key++}>{renderInline(line)}</p>);
    }
  }
  flushList();
  return blocks;
}

/** Render inline emphasis: **bold**, *italic*, and `code`. */
function renderInline(text: string): ReactNode {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={i}>{token.slice(1, -1)}</em>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-gray-200 px-1 py-0.5 font-mono text-[0.85em] dark:bg-gray-700">
          {token.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{token}</Fragment>;
  });
}
