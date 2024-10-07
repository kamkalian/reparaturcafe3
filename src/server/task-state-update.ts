'use server'
import { cookies } from "next/headers";

export async function updateTaskState(
  newState: string,
  taskID: string
) { 
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/state/update_state/' + parseInt(taskID) + "?task_state=" + newState, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        }
    }
  )
  if(!res.ok) {
      return false
  }
return true;
}