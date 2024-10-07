'use server'
import { cookies } from "next/headers";

export async function createRecord(
  supervisorID: string,
  taskID: string,
  comment: string,
  recordType: string
) { 

  const body = JSON.stringify({
    supervisor_id: supervisorID,
    task_id: taskID,
    comment: comment,
    record_type: recordType
  });   
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/log/create_record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        },
        body: body
    }
  )
  if(!res.ok) {
      return false
  }
  const data = await res.json();
return data;
}