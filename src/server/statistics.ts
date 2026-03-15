'use server'
import { cookies } from "next/headers";

export interface TasksPerMonth {
  year: number
  month: number
  count: number
}

export interface OpenTimeStat {
  avg_days: number | null
  min_days: number | null
  max_days: number | null
  total_open: number
}

export interface OpenTimeBucket {
  bucket: string
  count: number
}

export interface ManufacturerStat {
  manufacturer: string
  count: number
}

export interface OldestOpenTask {
  id: number
  creation_date: string
  device_name: string
  days_open: number
  last_comment_date: string | null
}

export interface ManufacturerTrendPoint {
  year: number
  month: number
  count: number
}

export interface ManufacturerTrend {
  manufacturer: string
  data: ManufacturerTrendPoint[]
}

export interface StatisticsResponse {
  tasks_per_month: TasksPerMonth[]
  oldest_open_tasks: OldestOpenTask[]
  manufacturers: ManufacturerStat[]
  manufacturer_trends: ManufacturerTrend[]
}

export async function fetchStatistics(params?: {
  fromYear?: number
  fromMonth?: number
  toYear?: number
  toMonth?: number
}): Promise<StatisticsResponse | null> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const url = new URL(process.env.NEXT_PUBLIC_API_URL + '/fastapi/statistics/all');
  if (params?.fromYear)  url.searchParams.set('from_year',  String(params.fromYear));
  if (params?.fromMonth) url.searchParams.set('from_month', String(params.fromMonth));
  if (params?.toYear)    url.searchParams.set('to_year',    String(params.toYear));
  if (params?.toMonth)   url.searchParams.set('to_month',   String(params.toMonth));

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': 'Bearer ' + session },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}

export async function fetchTasksPerMonth(params?: {
  fromYear?: number
  fromMonth?: number
  toYear?: number
  toMonth?: number
}): Promise<TasksPerMonth[]> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return [];

  const url = new URL(process.env.NEXT_PUBLIC_API_URL + '/fastapi/statistics/tasks_per_month');
  if (params?.fromYear)  url.searchParams.set('from_year',  String(params.fromYear));
  if (params?.fromMonth) url.searchParams.set('from_month', String(params.fromMonth));
  if (params?.toYear)    url.searchParams.set('to_year',    String(params.toYear));
  if (params?.toMonth)   url.searchParams.set('to_month',   String(params.toMonth));

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': 'Bearer ' + session },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  return res.json();
}

export interface ManufacturerTaskItem {
  id: number
  device_name: string
  creation_date: string
}

export interface ManufacturerSuggestion {
  suggested: string
  score: number
}

export async function fetchManufacturerTasks(manufacturer: string): Promise<ManufacturerTaskItem[]> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return [];

  const url = new URL(process.env.NEXT_PUBLIC_API_URL + '/fastapi/statistics/manufacturer_tasks');
  url.searchParams.set('manufacturer', manufacturer);

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': 'Bearer ' + session },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchManufacturerSuggestions(q: string): Promise<ManufacturerSuggestion[]> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return [];

  const url = new URL(process.env.NEXT_PUBLIC_API_URL + '/fastapi/statistics/manufacturer_suggestions');
  url.searchParams.set('q', q);

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': 'Bearer ' + session },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function updateTaskManufacturer(taskId: number, manufacturer: string): Promise<boolean> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return false;

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/fastapi/statistics/tasks/${taskId}/manufacturer`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + session,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ manufacturer }),
    }
  );
  return res.ok;
}

export interface ManufacturerSimilarPair {
  source: string
  source_count: number
  target: string
  target_count: number
  score: number
}

export async function fetchManufacturerSimilarPairs(): Promise<ManufacturerSimilarPair[]> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return [];

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/statistics/manufacturer_similar_pairs',
    {
      headers: { 'Authorization': 'Bearer ' + session },
      cache: 'no-store',
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function bulkRenameManufacturer(source: string, target: string): Promise<boolean> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return false;

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/statistics/manufacturer_bulk_rename',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source, target }),
    }
  );
  return res.ok;
}
