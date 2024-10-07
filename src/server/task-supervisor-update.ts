'use server'
import { cookies } from "next/headers";

export async function updateTaskSupervisor(
  supervisorID: string,
  taskID: string
) { 
  const body = JSON.stringify({
    supervisor_id: supervisorID
  });
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/task/update_supervisor/' + parseInt(taskID), {
        method: 'PATCH',
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
return true;
}