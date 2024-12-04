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

  const handlePrintButtonClick = () => {
    window.print();
  }

  const handlePrintQRCodeButtonClick = async () => {
    const body = JSON.stringify({
      task_id: data["id"]
    });  
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/fastapi/qrcode/print?task_id=' + data["id"] , {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: body
      }
    )
  }

  return(
    <>
      <div 
      className={clickable ?
        "w-full rounded-lg bg-info hover:bg-button-active hover:text-white cursor-pointer mb-4 p-4"
        : "w-full rounded-t-lg rounded-bl-lg bg-info p-4 print:p-2 print:mb-4 print:rounded-lg"
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
      <div className={clickable ? "hidden" : ""}>
        <div className="flex flex-row w-full bg-info-second print:hidden">
          <div className="flex-auto"><div className="w-full bg-white rounded-tr-lg h-3"></div></div>
          <div className="w-44 h-3"></div>
        </div>
        <div className="flex flex-row w-full mb-4 print:hidden">
          <div className="flex-auto"><div className="w-full bg-white rounded-tr-lg h-4"></div></div>
          <div className="flex flex-row w-44 pb-3 px-3 bg-info-second rounded-b-lg">
            <button 
            className="bg-button-active rounded-md px-4 text-white h-14 items-center justify-center flex print:hidden"
            onClick={handlePrintButtonClick}
            >
              <svg className="h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polyline points="6 9 6 2 18 2 18 9" />  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />  <rect x="6" y="14" width="12" height="8" /></svg>
            </button>
            <div className="flex-1"></div>
            <button 
            className="bg-button-active rounded-md px-4 text-white h-14 items-center justify-center flex print:hidden"
            onClick={handlePrintQRCodeButtonClick}
            >
              <svg className="h-8 w-8 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="4" width="6" height="6" rx="1" />  <line x1="7" y1="17" x2="7" y2="17.01" />  <rect x="14" y="4" width="6" height="6" rx="1" />  <line x1="7" y1="7" x2="7" y2="7.01" />  <rect x="4" y="14" width="6" height="6" rx="1" />  <line x1="17" y1="7" x2="17" y2="7.01" />  <line x1="14" y1="14" x2="17" y2="14" />  <line x1="20" y1="14" x2="20" y2="14.01" />  <line x1="14" y1="14" x2="14" y2="17" />  <line x1="14" y1="20" x2="17" y2="20" />  <line x1="17" y1="17" x2="20" y2="17" />  <line x1="20" y1="17" x2="20" y2="20" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}