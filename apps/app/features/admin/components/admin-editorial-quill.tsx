"use client";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const modules = {
  toolbar: [
    ["bold", "italic"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

/** Rich text body for problem editorial (HTML stored in DB inside JSON). */
export function AdminEditorialQuill({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <div className="admin-editorial-quill overflow-hidden rounded-md border border-border bg-background [&_.ql-container]:min-h-[160px] [&_.ql-editor]:min-h-[140px] [&_.ql-toolbar]:border-border">
      <ReactQuill
        modules={modules}
        onChange={onChange}
        placeholder="Editorial write-up (saved as HTML)…"
        theme="snow"
        value={value}
      />
    </div>
  );
}
