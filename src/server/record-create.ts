'use server'
import { cookies } from "next/headers";

export async function createRecord(
  supervisorID: string | null,
  taskID: string,
  comment: string,
  recordType: string,
): Promise<{ id: number } | { error: string }> {
  const body = JSON.stringify({
    supervisor_id: supervisorID ? Number(supervisorID) : null,
    task_id: Number(taskID),
    comment: comment,
    record_type: recordType,
  });

  const sessionCookie = (await cookies()).get("session")?.value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/fastapi/log/create_record';

  if (!sessionCookie) {
    console.error('[createRecord] No session cookie found');
    return { error: 'Nicht angemeldet – bitte neu einloggen.' };
  }

  let res: Response;
  try {
    res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionCookie,
      },
      body: body,
      cache: 'no-store',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[createRecord] fetch error:', msg);
    return { error: 'Netzwerkfehler: ' + msg };
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[createRecord] FAILED:', res.status, errText);
    return { error: `API-Fehler ${res.status}: ${errText}` };
  }

  const data = await res.json();
  if (!data?.id) {
    console.error('[createRecord] No id in response:', JSON.stringify(data));
    return { error: 'API hat keine log_id zurückgegeben: ' + JSON.stringify(data) };
  }
  return data; // { id: log_id }
}

