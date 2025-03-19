import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";

interface MarkdownProps extends Options {
  className?: string;
}

const MarkdownComponent: FC<MarkdownProps> = ({ className, ...props }) => (
  <div className={className}>
    <ReactMarkdown {...props} />
  </div>
);

export const MessageMarkdownMemoized = memo<MarkdownProps>(
  MarkdownComponent,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);
