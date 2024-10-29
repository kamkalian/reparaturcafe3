"use client";

import { useRouter } from "next/navigation";

export default function TaskCard({ data, clickable }) {
  const creationDate = new Date(data["creation_date"]).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const router = useRouter();
  const handleClick = () => {
    router.push('/task/' + data["id"]);
  }
  return(
    <div 
    className={clickable ?
      "w-full rounded-lg bg-info hover:bg-button-active hover:text-white cursor-pointer mb-4 p-4"
      : "w-full rounded-lg bg-info mb-4 p-4 print:p-2"
    }
    onClick={handleClick}
    >
      <div className="flex items-center space-x-10">
        <h3 className="text-3xl font-bold w-32 print:w-14 print:text-lg text-right">
          {data["id"]}
        </h3>
        <h3 className="font-bold 2xl:flex-block lg:text-3xl print:text-lg flex-auto">
          {data["device_name"]}
        </h3>

        {data["task_state"] == 'new' ? (
        <div className="bg-yellow-600/75 text-white font-bold text-3xl px-2 py-1 rounded-md screen:hidden screen:md:block print:hidden">
          Neu
        </div>
        ) : ""}
        {data["task_state"] == 'in_process' ? (
        <div className="bg-green-600/75 text-white font-bold text-3xl px-2 py-1 rounded-md screen:hidden screen:md:block print:hidden">
          In Arbeit
        </div>
        ) : ""}
        {data["task_state"] == 'done' ? (
        <div className="bg-blue-600/75 text-white font-bold text-3xl px-2 py-1 rounded-md screen:hidden screen:md:block print:hidden">
          Fertig
        </div>
        ) : ""}
        {data["task_state"] == 'completed' ? (
        <div className="bg-gray-600/75 text-white font-bold text-3xl px-2 py-1 rounded-md screen:hidden screen:md:block print:hidden">
          Abgeschlossen
        </div>
        ) : ""}
      </div>

    </div>
  );
}