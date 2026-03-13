import TaskListBar from "@/app/components/TaskListBar";
import TaskList from "../components/TaskList";
import AddButton from "@/app/components/AddButton";
import { Suspense } from "react";



export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    new?: string;
    in_process?: string;
    done?: string;
    completed?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || '';
  const stateFilters = [];
  if(resolvedParams?.new){
    stateFilters.push("new");
  }
  if(resolvedParams?.in_process){
    stateFilters.push("in_process");
  }
  if(resolvedParams?.done){
    stateFilters.push("done");
  }
  if(resolvedParams?.completed){
    stateFilters.push("completed");
  }


  return (
    <>
      <h2 className="text-4xl font-extrabold mb-6">Dashboard</h2>
      <Suspense fallback={null}>
        <TaskListBar/>
      </Suspense>
      <TaskList
        query={query}
        stateFilters={stateFilters}
      />      
    </>
  )
}