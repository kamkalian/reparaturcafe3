'use server'
import { cookies } from "next/headers";

export async function createOwner(
  ownerLastName: string,
  ownerFirstName: string,
  ownerPhone: string,
  ownerEmail: string,
  ownerStreet: string,
  ownerStreetNo: string,
  ownerZip: string,
) { 

  const body = JSON.stringify({
    last_name: ownerLastName, 
    first_name: ownerFirstName, 
    phone: ownerPhone,
    email: ownerEmail !== "" ? ownerEmail : null,
    street: ownerStreet,
    street_no: ownerStreetNo,
    zip: ownerZip
  });   
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/owner/create', {
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