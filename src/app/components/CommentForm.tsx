'use client'
 
import { useRouter } from 'next/navigation'
import React from "react";
import { useSnackbar, type ProviderContext } from 'notistack';
import { createRecord } from '@/server/record-create';

const MAX_FILE_SIZE_MB = 50;
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

interface Props {
  supervisorID: string,
  taskID?: string,
  deviceName?: string,
}

const enqeueSuccessfulNotification = (
  msg: string,
  { enqueueSnackbar }: ProviderContext
): void => {
  enqueueSnackbar(
    <div className='text-xl font-bold'>{msg}</div>,
    { variant: "success", persist: false, anchorOrigin: { horizontal: "right", vertical: "bottom" } }
  );
}

/** Verkleinert und komprimiert ein Bild via Canvas auf max. 1920px, JPEG 82% */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
          resolve(compressed);
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Bild konnte nicht geladen werden.")); };
    img.src = url;
  });
}

export default function CommentForm(props: Props) {
  const [comment, setComment] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [compressing, setCompressing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const snackbarContext = useSnackbar();

  const handleSaveButtonClick = async () => {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      const result = await createRecord(
        props.supervisorID,
        props.taskID ?? "",
        comment,
        "comment",
      );
      if (result?.id && image) {
        const uploadForm = new FormData();
        uploadForm.append("log_id", String(result.id));
        uploadForm.append("task_id", props.taskID ?? "");
        uploadForm.append("device_name", props.deviceName ?? "");
        uploadForm.append("image", image);
        await fetch("/api/upload-image", { method: "POST", body: uploadForm });
      }
      setComment("");
      setImage(null);
      setImagePreview(null);
      setImageError(null);
      enqeueSuccessfulNotification("Kommentar gespeichert.", snackbarContext);
      router.refresh();
      router.push('/task/' + props.taskID);
    } finally {
      setSaving(false);
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageError(null);
    setImage(null);
    setImagePreview(null);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setImageError(`Das Foto ist zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximal ${MAX_FILE_SIZE_MB} MB erlaubt.`);
      e.target.value = "";
      return;
    }

    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setImage(compressed);
      const preview = URL.createObjectURL(compressed);
      setImagePreview(preview);
    } catch {
      setImageError("Bild konnte nicht verarbeitet werden.");
    } finally {
      setCompressing(false);
    }
  }

  const canSave = comment.trim().length > 0 && !saving && !compressing;

  return (
    <div className="border-2 border-white rounded-lg mt-4 flex-col w-full content-end print:hidden">
      <form className="flex-col w-full">
        <div className="w-full p-3">
          <label htmlFor="device-error-description" className="block mb-2 text-black font-thin">Kommentar</label>
          <textarea
            id="device-error-description"
            rows={4}
            className="block p-2.5 w-full text-gray-900 bg-white rounded-lg border border-gray-300"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="w-full p-3">
          <label className="block mb-2 text-black font-thin">Foto hochladen (optional)</label>
          <input
            ref={fileInputRef}
            id="comment-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            className="bg-button-active text-white rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? "Anderes Foto wählen" : "Foto auswählen"}
          </button>
          {compressing && (
            <span className="ml-3 text-sm text-gray-500">Wird verkleinert…</span>
          )}
          {image && !compressing && (
            <span className="ml-3 text-sm text-gray-500">
              {image.name} ({(image.size / 1024).toFixed(0)} KB)
            </span>
          )}
          {imageError && (
            <p className="mt-2 text-red-600 text-sm">{imageError}</p>
          )}
          {imagePreview && !compressing && (
            <div className="mt-2">
              <img src={imagePreview} alt="Vorschau" className="max-h-48 rounded-lg border border-gray-300" />
            </div>
          )}
        </div>
      </form>
      <div className="w-full px-3 pb-3">
        <button
          className={`rounded-lg p-3 w-full text-white transition-opacity ${canSave ? "bg-button-active hover:opacity-90" : "bg-button-inactive cursor-not-allowed opacity-60"}`}
          onClick={handleSaveButtonClick}
          disabled={!canSave}
        >
          {saving ? "Wird gespeichert…" : "Speichern"}
        </button>
      </div>
    </div>
  )
}

