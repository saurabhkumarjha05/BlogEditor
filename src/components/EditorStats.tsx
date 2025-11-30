import { Clock, Type, FileText } from "lucide-react";

interface EditorStatsProps {
  wordCount: number;
  charCount: number;
  readingTime: number;
}

export const EditorStats = ({ wordCount, charCount, readingTime }: EditorStatsProps) => {
  return (
    <div className="flex gap-6 text-sm text-muted-foreground font-mono">
      <div className="flex items-center gap-2">
        <Type className="h-4 w-4" />
        <span>{wordCount} words</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span>{charCount} chars</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
};
