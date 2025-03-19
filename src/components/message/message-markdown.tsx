import { Children, isValidElement, ReactElement } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MessageCodeBlock } from "./message-codeblock";
import { MessageMarkdownMemoized } from "./message-markdown-memoized";

interface MessageMarkdownProps {
  content: string;
}

export const MessageMarkdown = ({ content }: MessageMarkdownProps) => {
  return (
    <MessageMarkdownMemoized
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        img({ node, ...props }) {
          return <img className="max-w-[67%]" {...props} />;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        code({ node, className, children, ...props }) {
          const childArray = Children.toArray(children);
          const firstChild = childArray[0] as ReactElement;
          const firstChildAsString = isValidElement(firstChild)
            ? (firstChild as ReactElement<React.HTMLAttributes<HTMLElement>>)
                .props.children
            : firstChild;

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>;
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍");
          }

          const match = /language-(\w+)/.exec(className || "");

          if (
            typeof firstChildAsString === "string" &&
            !firstChildAsString.includes("\n")
          ) {
            return (
              <code className={className} {...props}>
                {childArray}
              </code>
            );
          }

          return (
            <MessageCodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(childArray).replace(/\n$/, "")}
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </MessageMarkdownMemoized>
  );
};
