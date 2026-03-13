'use server'
import { cookies } from "next/headers";

export async function createRecord(
  supervisorID: string,
  taskID: string,
  comment: string,
  recordType: string,
) {
  const body = JSON.stringify({
    supervisor_id: supervisorID,
    task_id: Number(taskID),
    comment: comment,
    record_type: recordType,
  });

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/log/create_record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (await cookies()).get("session")?.value
        },
        body: body
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json();
  return data; // { id: log_id }
}

