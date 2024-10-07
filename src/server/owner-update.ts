'use server'
import { cookies } from "next/headers";

export async function updateOwner(
  ownerID: string,
  lastName: string,
  firstName: string,
  phone: string,
  email: string,
  street: string,
  streetNo: string,
  zip: string
) { 
  const body = JSON.stringify({
    last_name: lastName, 
    first_name: firstName, 
    phone: phone,
    email: email,
    street: street,
    street_no: streetNo,
    zip: zip
  });
  console.log(body)
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/owner/update/' + parseInt(ownerID), {
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
  const data = await res.json();
return data;
}