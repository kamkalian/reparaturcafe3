'use server'
import { cookies } from "next/headers";

export async function updateTaskDevice(
  taskID: string,
  deviceName: string,
  deviceErrorDescription: string,
  deviceManafacturer: string,
  deviceModel: string,
) { 
  const body = JSON.stringify({
    device_name: deviceName, 
    device_error_description: deviceErrorDescription, 
    device_manufacturer: deviceManafacturer,
    device_model: deviceModel,
  });   
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/task/update_device/' + parseInt(taskID), {
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