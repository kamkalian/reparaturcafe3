'use server'
import { cookies } from "next/headers";

export async function LogList(
  taskID?: string
) { 
 
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/log/all/' + taskID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        }
    }
  )
  if(!res.ok) {
      return []
  }
  const data = await res.json();
return data;
}