import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Button } from "./button";
import { Upload } from "lucide-react";

interface DropzoneProps {
  onDrop: (acceptedFiles: FileWithPath[]) => void;
  accept?: Record<string, string[]>;
  className?: string;
  children?: React.ReactNode;
}

export function Dropzone({
  onDrop,
  accept,
  className = "",
  children,
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      open();
    },
    [open]
  );

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/10" : "border-border"
      } ${className}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        {children ? (
          children
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, PNG, PDF (max 10MB)
              </p>
            </div>
            <Button variant="outline" type="button" onClick={handleClick}>
              Select Files
            </Button>
          </>
        )}
      </div>
    </div>
  );
}