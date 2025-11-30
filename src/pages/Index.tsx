import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownToolbar } from "@/components/MarkdownToolbar";
import { EditorStats } from "@/components/EditorStats";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { toast } from "sonner";
import {
  Download,
  Eye,
  Save,
  Maximize2,
  Minimize2,
  FileText,
  GripVertical,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem("blog-draft");
    if (draft) {
      const data = JSON.parse(draft);
      setTitle(data.title || "");
      setContent(data.content || "");
      setCoverImage(data.coverImage || "");
    }
  }, []);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setCharCount(content.length);
    setReadingTime(Math.ceil(words / 200));

    const saveTimer = setTimeout(() => {
      localStorage.setItem(
        "blog-draft",
        JSON.stringify({ title, content, coverImage })
      );
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [title, content, coverImage]);

  const handleInsert = (syntax: string, placeholder?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder || "";

    let newText = "";
    if (syntax.includes("\n")) {
      newText = content.substring(0, start) + syntax.replace("code here", textToInsert) + content.substring(end);
    } else if (syntax.endsWith(" ")) {
      newText = content.substring(0, start) + syntax + textToInsert + content.substring(end);
    } else {
      newText = content.substring(0, start) + syntax + textToInsert + syntax + content.substring(end);
    }

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + syntax.length;
      textarea.selectionEnd = start + syntax.length + textToInsert.length;
    }, 0);
  };

  const handleSave = () => {
    localStorage.setItem(
      "blog-draft",
      JSON.stringify({ title, content, coverImage })
    );
    toast.success("Draft saved successfully!");
  };

  const handleDownload = (format: "txt" | "md") => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "untitled"}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${format.toUpperCase()}`);
  };

  const handlePublish = () => {
    localStorage.setItem(
      "blog-draft",
      JSON.stringify({ title, content, coverImage })
    );
    navigate("/publish");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b-4 border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Blog Editor Pro</h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <EditorStats
                wordCount={wordCount}
                charCount={charCount}
                readingTime={readingTime}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-2 border-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("md")}
                className="gap-2 border-2"
              >
                <Download className="h-4 w-4" />
                .md
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("txt")}
                className="gap-2 border-2"
              >
                <Download className="h-4 w-4" />
                .txt
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="gap-2 border-2"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <ThemeSwitcher />

              <Button
                onClick={handlePublish}
                size="sm"
                className="gap-2 border-2"
              >
                <Eye className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <Input
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-2 h-12"
            />
            <Input
              placeholder="Cover Image URL (optional)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="border-2 h-12"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {isFullscreen ? (
          <div className="h-full flex flex-col">
            <MarkdownToolbar onInsert={handleInsert} />
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your blog in markdown..."
              className="flex-1 resize-none border-0 rounded-none font-mono text-base p-6 focus-visible:ring-0"
            />
          </div>
        ) : (
          <PanelGroup direction="horizontal" className="h-full">
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col border-r-4 border-border">
                <MarkdownToolbar onInsert={handleInsert} />
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your blog in markdown..."
                  className="flex-1 resize-none border-0 rounded-none font-mono text-base p-6 focus-visible:ring-0"
                />
              </div>
            </Panel>

            <PanelResizeHandle className="w-2 bg-border hover:bg-primary transition-colors flex items-center justify-center group">
              <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            </PanelResizeHandle>

            <Panel defaultSize={50} minSize={30}>
              <div className="h-full overflow-auto p-6 bg-card">
                <article className="max-w-3xl mx-auto">
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-[300px] object-cover mb-6 border-4 border-border shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        toast.error("Invalid image URL");
                      }}
                    />
                  )}
                  {title && (
                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                      {title}
                    </h1>
                  )}
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || "*Preview will appear here...*"}
                    </ReactMarkdown>
                  </div>
                </article>
              </div>
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
};

export default Index;
