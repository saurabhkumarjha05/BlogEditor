import { Button } from "@/components/ui/button";
import { Bold, Italic, Heading1, Heading2, List, Code } from "lucide-react";

interface MarkdownToolbarProps {
  onInsert: (syntax: string, placeholder?: string) => void;
}

export const MarkdownToolbar = ({ onInsert }: MarkdownToolbarProps) => {
  const tools = [
    { icon: Bold, syntax: "**", placeholder: "bold text", label: "Bold" },
    { icon: Italic, syntax: "*", placeholder: "italic text", label: "Italic" },
    { icon: Heading1, syntax: "# ", placeholder: "Heading 1", label: "H1", prefix: true },
    { icon: Heading2, syntax: "## ", placeholder: "Heading 2", label: "H2", prefix: true },
    { icon: List, syntax: "- ", placeholder: "List item", label: "List", prefix: true },
    { icon: Code, syntax: "```\n", placeholder: "code here\n```", label: "Code", multiline: true },
  ];

  return (
    <div className="flex gap-1 p-2 border-b-2 border-border bg-secondary/30">
      {tools.map((tool) => (
        <Button
          key={tool.label}
          variant="ghost"
          size="sm"
          onClick={() => onInsert(tool.syntax, tool.placeholder)}
          className="h-9 w-9 p-0 hover:bg-accent transition-all"
          title={tool.label}
        >
          <tool.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};
