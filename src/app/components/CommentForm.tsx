"use client";

import { useState, useRef, useCallback } from "react";
import { createRecord } from "@/server/record-create";
import type { LogRow } from "./LogItemList";

interface CommentFormProps {
  taskID: string;
  supervisorID: string;
  deviceName: string;
  supervisorName?: string | null;
  onCommentSaved?: (log: LogRow) => void;
  onImageUploaded?: (id: number, imageUrl: string) => void;
}

const MAX_COMMENT_LENGTH = 1000;

export default function CommentForm({ taskID, supervisorID, deviceName, supervisorName, onCommentSaved, onImageUploaded }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_COMMENT_LENGTH - comment.length;
  const isAtLimit = remaining === 0;
  const isNearLimit = remaining <= 50 && remaining > 0;
  const canSave = comment.trim().length > 0 && !isSaving && !isCompressing;

  const compressImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX_SIZE = 1920;
        let { width, height } = img;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
                type: "image/jpeg",
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.82
        );
      };
      img.src = url;
    });
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const MAX_FILE_SIZE_MB = 50;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`Datei zu groß: ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum: ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

      setError(null);
      setIsCompressing(true);
      setImageInfo("Wird verkleinert…");

      const compressed = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressed);
      setImageFile(compressed);
      setImagePreview(previewUrl);
      setImageInfo(`${(compressed.size / 1024).toFixed(0)} KB`);
      setIsCompressing(false);
    },
    [compressImage]
  );

  const handleSubmit = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);

    try {
      const result = await createRecord(supervisorID, taskID, comment, "comment");
      if (!result?.id) throw new Error("Kein log_id erhalten");

      let finalImageUrl: string | null = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("log_id", String(result.id));
        formData.append("task_id", String(taskID));
        formData.append("device_name", deviceName);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Bild-Upload fehlgeschlagen");
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.image_url ?? null;
      }

      const newLog: LogRow = {
        id: result.id,
        creation_date: new Date().toISOString(),
        comment: comment,
        record_type: "comment",
        supervisor_name: supervisorName ?? null,
        image_url: finalImageUrl,
      };
      onCommentSaved?.(newLog);

      setComment("");
      setImageFile(null);
      setImagePreview(null);
      setImageInfo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-3 mt-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-300 rounded p-2">
          {error}
        </div>
      )}

      {/* Kommentarfeld mit Zähler */}
      <div className="flex flex-col w-full">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Kommentar eingeben..."
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(e) => setComment(e.target.value)}
        />
        <div
          className={`text-sm text-right mt-1 transition-colors ${
            isAtLimit
              ? "text-red-600 font-semibold"
              : isNearLimit
              ? "text-orange-500"
              : "text-gray-400"
          }`}
        >
          {isAtLimit ? "Zeichenlimit erreicht!" : `${remaining} Zeichen verbleibend`}
        </div>
      </div>

      {/* Foto-Upload */}
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isCompressing}
          className="px-4 py-2 rounded-md bg-button-active text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed w-fit"
        >
          {isCompressing ? "Wird verkleinert…" : "📎 Foto auswählen"}
        </button>

        {imagePreview && (
          <div className="flex items-center gap-3">
            <img
              src={imagePreview}
              alt="Vorschau"
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
            <div className="flex flex-col text-sm text-gray-500">
              <span>{imageInfo}</span>
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  setImageInfo(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-red-500 hover:underline text-left mt-1"
              >
                Entfernen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Speichern-Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSave}
        className={`px-4 py-2 rounded-md text-white transition-colors ${
          canSave
            ? "bg-button-active hover:opacity-90 cursor-pointer"
            : "bg-button-inactive cursor-not-allowed opacity-50"
        }`}
      >
        {isSaving ? "Wird gespeichert…" : "Speichern"}
      </button>
    </div>
  );
}

