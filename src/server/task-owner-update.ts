'use server'
import { cookies } from "next/headers";

export async function updateTaskOwner(
  ownerID: string,
  taskID: string
) { 
  const body = JSON.stringify({
    owner_id: ownerID
  });
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/task/update_owner/' + parseInt(taskID), {
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
  //const data = await res.json();
return true;
}