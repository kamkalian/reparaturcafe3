'use client'

import React from "react";

interface LogRow {
  id: number;
  creation_date: string;
  comment: string;
  record_type: string;
  supervisor_name: string | null;
  image_url: string | null;
}

interface Props {
  logs: LogRow[];
}

export default function LogItemList({ logs }: Props) {
  const [lightboxSrc, setLightboxSrc] = React.useState<string | null>(null);

  return (
    <>
      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 print:hidden"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-black/80"
              onClick={() => setLightboxSrc(null)}
            >
              ✕
            </button>
            <img
              src={lightboxSrc}
              alt="Vollbild"
              className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Log entries */}
      <div className="flex flex-col w-full mt-4">
        {logs.map((row, index) => {
        const icon =
          row.record_type === "action" ? (
            <svg
              className="h-8 w-8 print:h-4 print:w-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          ) : row.record_type === "comment" ? (
            <svg
              className="h-8 w-8 print:h-4 print:w-4 text-gray-400 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
              <line x1="8" y1="9" x2="16" y2="9" />
              <line x1="8" y1="13" x2="14" y2="13" />
            </svg>
          ) : null;

        const creationDate = new Date(row.creation_date);
        const creationDateFormatted = creationDate.toLocaleDateString("de-DE", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        });

        const commentClass =
          row.record_type === "action" ? "w-full font-thin" : "w-full";

        const imgSrc = row.image_url ?? null;

        return (
          <div className="w-full py-1 mb-1 border-b" key={index}>
            <div className="flex flex-row items-start space-x-4">
              <div className="shrink-0">{icon}</div>
              <div className={commentClass}>
                <span>{row.comment}</span>
                {imgSrc && (
                  <div className="mt-2 print:mt-1">
                    <img
                      src={imgSrc}
                      alt="Foto"
                      className="max-h-32 rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity print:max-h-20"
                      onClick={() => setLightboxSrc(imgSrc)}
                      title="Klicken für Vollbild"
                    />
                  </div>
                )}
              </div>
              <div className="text-right w-1/4 print:w-1/3 font-thin shrink-0">
                {row.supervisor_name} / {creationDateFormatted}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}
