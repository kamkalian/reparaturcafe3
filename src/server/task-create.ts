'use server'
import { cookies } from "next/headers";

export async function createTask(
  deviceName: string,
  deviceErrorDescription: string,
  deviceManafacturer: string,
  deviceModel: string,
) {
  const body = JSON.stringify({
    device_name: deviceName, 
    device_error_description: deviceErrorDescription ? deviceErrorDescription : "", 
    device_manufacturer: deviceManafacturer ? deviceManafacturer : "",
    device_model: deviceModel ? deviceModel : "",
  });   
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/task/create', {
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