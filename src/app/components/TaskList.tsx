import { cookies } from "next/headers";
import TaskCard from "./TaskCard";


async function getData(query: string | undefined, stateFilters: string[] | undefined) {
  const access_token = cookies().get('session')

  let url_param = "";
  const params = [];
  if (query !== ""){
    params.push("search_term=" + query);
  }

  stateFilters?.forEach(element => {
    params.push(element + "=1");
  });

  if(params.length > 0){
    url_param = "?" + Array.prototype.join.call(params, "&");
  }

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/task/all' + url_param, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        }
    }
  )

  if(!res.ok) {
      return []
  }
  const data = await res.json()
  return data
}


export default async function TaskList({
  query,
  stateFilters
}: {
  query: string | undefined;
  stateFilters: string[] | undefined;
}) {
  const data = await getData(query, stateFilters)
  const cards = data.map((row, index) => {
    return (
      <TaskCard 
        data={row} 
        clickable
        key={index}></TaskCard>
    )
  })
  
  return(
    <div>
        {data.length === 0 ? (
          <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-100" role="alert">
          Keine Einträge gefunden.
          </div>
        ) : (
          <div className="p-4">
            Gefundene Datensätze: {data.length}
            <hr></hr>
          </div>
        )}
        {cards}
    </div>
  );
}