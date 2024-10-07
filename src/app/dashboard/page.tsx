import TaskListBar from "@/app/components/TaskListBar";
import TaskList from "../components/TaskList";
import AddButton from "@/app/components/AddButton";



export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    new?: string;
    in_process?: string;
    done?: string;
    completed?: string;
  };
}) {
  const query = searchParams?.query || '';
  const stateFilters = [];
  if(searchParams?.new){
    stateFilters.push("new");
  }
  if(searchParams?.in_process){
    stateFilters.push("in_process");
  }
  if(searchParams?.done){
    stateFilters.push("done");
  }
  if(searchParams?.completed){
    stateFilters.push("completed");
  }


  return (
    <>
      <h2 className="text-4xl font-extrabold mb-6">Dashboard</h2>
      <TaskListBar/>
      <TaskList
        query={query}
        stateFilters={stateFilters}
      />      
    </>
  )
}