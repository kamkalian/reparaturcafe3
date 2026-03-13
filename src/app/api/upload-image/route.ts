import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const logId = formData.get("log_id");
  const taskId = formData.get("task_id");
  const deviceName = String(formData.get("device_name") ?? "unbekannt").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const image = formData.get("image") as File | null;

  if (!image || !logId) {
    return NextResponse.json({ error: "Fehlende Parameter" }, { status: 400 });
  }

  // Dateiname: taskID_geraetename_timestamp.ext
  const ext = image.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Dateityp nicht erlaubt" }, { status: 400 });
  }
  if (image.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Datei zu groß (max. 10 MB)" }, { status: 400 });
  }

  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 15);
  const filename = `${taskId}_${deviceName}_${timestamp}.${ext}`;
  const relPath = `/images/comments/${filename}`;

  // Schreibe in public/images/comments/
  const publicDir = path.join(process.cwd(), "public", "images", "comments");
  await mkdir(publicDir, { recursive: true });
  const bytes = await image.arrayBuffer();
  await writeFile(path.join(publicDir, filename), new Uint8Array(bytes));

  // Informiere FastAPI, damit die DB aktualisiert wird
  const session = cookies().get("session")?.value;
  const apiRes = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/fastapi/log/set_image_url/${logId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session,
      },
      body: JSON.stringify({ image_url: relPath }),
    }
  );

  if (!apiRes.ok) {
    const text = await apiRes.text();
    return NextResponse.json({ error: text }, { status: apiRes.status });
  }

  return NextResponse.json({ image_url: relPath });
}
