import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";

const Publish = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const draft = localStorage.getItem("blog-draft");
    if (draft) {
      const data = JSON.parse(draft);
      setTitle(data.title || "Untitled Post");
      setContent(data.content || "");
      setCoverImage(data.coverImage || "");

      const words = data.content.trim().split(/\s+/).length;
      setReadingTime(Math.ceil(words / 200));

      const date = new Date();
      setPublishDate(
        date.toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
  }, []);

  const exportPDF = () => {
    const pdf = new jsPDF();
    const lineHeight = 7;
    let y = 20;

    pdf.setFontSize(20);
    pdf.text(title, 20, y);
    y += lineHeight * 2;

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(publishDate, 20, y);
    y += lineHeight;
    pdf.text(`${readingTime} min read`, 20, y);
    y += lineHeight * 2;

    pdf.setFontSize(12);
    pdf.setTextColor(0);
    const lines = pdf.splitTextToSize(content, 170);
    lines.forEach((line: string) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 20, y);
      y += lineHeight;
    });

    pdf.save(`${title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 border-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </Button>
          <Button
            onClick={exportPDF}
            variant="default"
            size="sm"
            className="border-2"
          >
            Export PDF
          </Button>
        </div>
      </div>

      <article className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-[400px] object-cover mb-8 border-4 border-border shadow-lg"
          />
        )}

        <h1 className="text-5xl font-bold mb-4 leading-tight">{title}</h1>

        <div className="flex gap-4 text-muted-foreground text-sm mb-8 font-mono">
          <span>{publishDate}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default Publish;
