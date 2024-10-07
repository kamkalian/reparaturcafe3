'use server'
import { cookies } from "next/headers";

export async function searchOwner(
  ownerSearchString?: string
) { 
  const body = JSON.stringify({
    search: ownerSearchString
  });
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/owner/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        },
        body: body
    }
  )
  if(!res.ok) {
      return []
  }
  const data = await res.json();
return data;
}