"use client";

import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { PRODUCT_IMAGE_TYPES, validateProductImage } from "@/lib/product-images";

export function ProductImageUpload({ initialImage = "" }: { initialImage?: string }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState(initialImage);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function selectFiles(files: File[]) {
    const validation = files.length !== 1
      ? "Please choose one product image at a time."
      : validateProductImage(files[0]);
    const nextFile = validation ? file : files[0];
    // Keep browse and drop selections in the actual file input sent with the form.
    const transfer = new DataTransfer();
    if (nextFile) transfer.items.add(nextFile);
    if (inputRef.current) inputRef.current.files = transfer.files;
    setError(validation ?? "");
    if (!validation && nextFile) {
      setFile(nextFile);
      setPreview(URL.createObjectURL(nextFile));
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (inputRef.current?.matches(":disabled")) return;
    selectFiles(Array.from(event.dataTransfer.files));
  }

  function removeImage() {
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
    setPreview("");
    setImage("");
    setError("");
  }

  return (
    <div className="min-w-0">
      <span id={`${id}-label`} className="admin-label">Product image</span>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        onDragEnter={(event) => {
          event.preventDefault();
          if (inputRef.current?.matches(":disabled")) return;
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) setDragging(false);
        }}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-4 transition-colors ${dragging ? "border-emerald-600 bg-emerald-50" : "border-stone-300 bg-stone-50"}`}
      >
        {(file ? preview : image) ? (
          <ProductImage image={file ? preview : image} name="Product image preview" className="mb-3 max-h-40 w-full" />
        ) : <ImagePlus aria-hidden="true" className="mx-auto mb-2 h-8 w-8 text-emerald-800" />}
        <p className="text-center text-sm font-semibold">{dragging ? "Drop your image here" : "Drag and drop a product photo here"}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-secondary py-2" onClick={() => inputRef.current?.click()}>
            <Upload aria-hidden="true" size={16} /> {file || image ? "Change image" : "Browse images"}
          </button>
          {(file || image) && <button type="button" className="btn-secondary py-2" onClick={removeImage}>Remove image</button>}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          name="imageFile"
          accept={PRODUCT_IMAGE_TYPES.join(",")}
          aria-label="Choose product image"
          aria-describedby={`${id}-help ${id}-error`}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            if (event.target.files?.length) selectFiles(Array.from(event.target.files));
          }}
        />
        <p id={`${id}-help`} className="mt-2 text-center text-xs text-stone-500">JPG, PNG, WebP or GIF · Up to 3 MB</p>
        {file && <p className="mt-2 break-all text-center text-xs text-stone-600">{file.name} · Ready to save</p>}
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-700">{error}</p>
      </div>
      <details className="mt-2 text-sm text-stone-600">
        <summary className="cursor-pointer">Or use an image URL / gradient</summary>
        <label className="mt-2 block">
          <span className="sr-only">Image URL or CSS gradient</span>
          <input name="image" className="admin-input" value={image} disabled={!!file} onChange={(event) => setImage(event.target.value)} placeholder="https://example.com/product.jpg" />
        </label>
      </details>
    </div>
  );
}
