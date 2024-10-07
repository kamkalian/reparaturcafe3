'use server'
import { cookies } from "next/headers";

export async function updateLocation(
  shelfNo: string,
  shelfFloorNo: string,
  otherLocation: string,
  taskID: string
) { 

  const body = JSON.stringify({
    shelf_no: shelfNo ? shelfNo : "", 
    shelf_floor_no: shelfFloorNo ? shelfFloorNo : "", 
    other_location: otherLocation ? otherLocation : ""
  });

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/location/update/' + parseInt(taskID), {
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