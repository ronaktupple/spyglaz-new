import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Eye,
  File,
  Image,
  FileText,
  FileVideo,
  FileAudio,
  Archive,
  Code,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";

const GeneratedFilesDisplay = ({ files = [] }) => {
  console.log("GeneratedFilesDisplay rendering with files:", files);

  if (!files || files.length === 0) return null;

  const getFileIcon = (mimeType, filename) => {
    if (mimeType?.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (mimeType?.startsWith("video/"))
      return <FileVideo className="w-4 h-4" />;
    if (mimeType?.startsWith("audio/"))
      return <FileAudio className="w-4 h-4" />;
    if (
      mimeType?.includes("pdf") ||
      mimeType?.includes("word") ||
      mimeType?.includes("powerpoint")
    )
      return <FileText className="w-4 h-4" />;
    if (
      mimeType?.includes("excel") ||
      mimeType?.includes("spreadsheet") ||
      mimeType?.includes("csv")
    )
      return <FileSpreadsheet className="w-4 h-4" />;
    if (mimeType?.includes("presentation") || mimeType?.includes("powerpoint"))
      return <Presentation className="w-4 h-4" />;
    if (
      mimeType?.includes("zip") ||
      mimeType?.includes("rar") ||
      mimeType?.includes("tar")
    )
      return <Archive className="w-4 h-4" />;
    if (
      mimeType?.includes("json") ||
      mimeType?.includes("xml") ||
      mimeType?.includes("yaml") ||
      filename?.match(/\.(js|ts|py|java|cpp|c|html|css)$/)
    )
      return <Code className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const getFileType = (mimeType, filename) => {
    // Check filename extension first for better detection
    if (filename?.match(/\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i)) return "image";
    if (filename?.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)) return "video";
    if (filename?.match(/\.(mp3|wav|flac|aac|ogg)$/i)) return "audio";
    if (filename?.match(/\.(pdf|doc|docx|txt|rtf)$/i)) return "document";
    if (filename?.match(/\.(xls|xlsx|csv)$/i)) return "spreadsheet";
    if (filename?.match(/\.(ppt|pptx)$/i)) return "presentation";
    if (filename?.match(/\.(zip|rar|tar|gz)$/i)) return "archive";
    if (filename?.match(/\.(js|ts|py|java|cpp|c|html|css|json|xml|yaml)$/i))
      return "code";

    // Fallback to MIME type detection
    if (mimeType?.startsWith("image/")) return "image";
    if (mimeType?.startsWith("video/")) return "video";
    if (mimeType?.startsWith("audio/")) return "audio";
    if (
      mimeType?.includes("pdf") ||
      mimeType?.includes("word") ||
      mimeType?.includes("powerpoint")
    )
      return "document";
    if (
      mimeType?.includes("excel") ||
      mimeType?.includes("spreadsheet") ||
      mimeType?.includes("csv")
    )
      return "spreadsheet";
    if (mimeType?.includes("presentation") || mimeType?.includes("powerpoint"))
      return "presentation";
    if (
      mimeType?.includes("zip") ||
      mimeType?.includes("rar") ||
      mimeType?.includes("tar")
    )
      return "archive";
    if (
      mimeType?.includes("json") ||
      mimeType?.includes("xml") ||
      mimeType?.includes("yaml")
    )
      return "code";

    return "other";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="mt-4 p-4 shadow-soft bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-sm font-medium text-blue-700">
          Generated Files
        </span>
        <Badge variant="secondary" className="text-xs">
          {files.length} file{files.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-3">
        {files.map((file, index) => {
          const fileType = getFileType(file.mime_type, file.filename);
          const isImage = fileType === "image";

          return (
            <>
              <img
                src={file.download_url}
                alt={file.filename}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
                onLoad={() => {
                  // Image loaded successfully
                  console.log("Image preview loaded:", file.filename);
                }}
              />

              <div
                key={file.filename || index}
                className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30 hover:bg-background/70 transition-colors"
              >
                {/* File Icon or Image Preview */}

                <div className="flex-shrink-0">
                  {isImage && file.download_url ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border/20">
                      <img
                        src={file.download_url}
                        alt={file.filename}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                        onLoad={() => {
                          // Image loaded successfully
                          console.log("Image preview loaded:", file.filename);
                        }}
                      />
                      <div
                        className="w-full h-full bg-muted flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        {getFileIcon(file.mime_type, file.filename)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {getFileIcon(file.mime_type, file.filename)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate text-foreground">
                      {file.filename || `Generated file ${index + 1}`}
                    </p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {fileType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.mime_type || "Unknown type"}</span>
                    {file.size && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(file.size)}</span>
                      </>
                    )}
                    {file.tool && (
                      <>
                        <span>•</span>
                        <span>Generated by {file.tool}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  {file.download_url && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        onClick={() => window.open(file.download_url, "_blank")}
                        title="Preview file"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        onClick={async () => {
                          try {
                            const response = await fetch(file.download_url);
                            const blob = await response.blob();

                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = file.filename || "generated-file";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                          } catch (err) {
                            console.error("Download failed:", err);
                          }
                        }}
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </Button> */}
                    </>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        Files generated by AI agent • Click to preview or download
      </div>
    </Card>
  );
};

export default GeneratedFilesDisplay;
