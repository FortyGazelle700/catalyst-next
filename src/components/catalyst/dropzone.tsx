"use client";

import { Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function Dropzone({ onUpload }: { onUpload: (file: FileList) => void }) {
  const popover = useRef<HTMLDialogElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    const onDragOver = (evt: DragEvent) => {
      evt.preventDefault();
      popover.current?.showModal();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        popover.current?.close();
      }, 100);
    };
    const onDrop = (evt: DragEvent) => {
      evt.preventDefault();
      onUpload(evt.dataTransfer?.files ?? new FileList());
      popover.current?.close();
    };
    const onDragEnd = () => {
      popover.current?.close();
    };
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragend", onDragEnd);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, [onUpload]);

  return isClient ? (
    createPortal(
      <dialog
        ref={popover}
        className="fixed left-0 top-0 z-50 m-0 hidden h-screen max-h-screen w-screen max-w-[100vw] place-items-center backdrop-blur [&[open]]:grid"
      >
        <div className="grid place-items-center border gap-1 px-8 py-12 rounded-sm cursor-pointer bg-background w-[40ch]">
          <span className="flex gap-1 items-center text-muted-foreground text-xs">
            <Upload className="size-3" /> Drop to Upload
          </span>
          <div className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
            Maximum of 512 MB files
          </div>
          <div className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
            Files will not be submitted when dropped
          </div>
        </div>
      </dialog>,
      document.body
    )
  ) : (
    <dialog />
  );
}
