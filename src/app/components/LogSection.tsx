"use client";

import { useState } from "react";
import LogItemList, { type LogRow } from "./LogItemList";
import CommentForm from "./CommentForm";

interface LogSectionProps {
  initialLogs: LogRow[];
  supervisorID: string;
  supervisorName: string | null;
  taskID: string;
  deviceName: string;
}

export default function LogSection({
  initialLogs,
  supervisorID,
  supervisorName,
  taskID,
  deviceName,
}: LogSectionProps) {
  const [logs, setLogs] = useState<LogRow[]>(initialLogs);

  function handleCommentSaved(newLog: LogRow) {
    setLogs((prev) => [...prev, newLog]);
  }

  return (
    <>
      <LogItemList logs={logs} />
      <CommentForm
        supervisorID={supervisorID}
        supervisorName={supervisorName}
        taskID={taskID}
        deviceName={deviceName}
        onCommentSaved={handleCommentSaved}
      />
    </>
  );
}
