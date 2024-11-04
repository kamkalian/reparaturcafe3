import TaskCard from "@/app/components/TaskCard";
import TaskDeviceArea from "@/app/components/TaskDeviceArea";
import TaskOwnerArea from "@/app/components/TaskOwnerArea"
import TaskStateArea from "@/app/components/TaskStateArea";
import TaskLocationArea from "@/app/components/TaskLocationArea";
import { userList } from "@/server/user-list";
import { LogList } from "@/server/log-list";
import { cookies } from "next/headers";
import CommentForm from "@/app/components/CommentForm";
import { getUserID } from "@/server/auth";


async function getData(id: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/task/get_by_id/' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        }
    }
  )
  if(!res.ok) {
      return null
  }
  const data = await res.json()

  return data
}


async function getOwnerData(id: string) {
  if(id === null) return null;
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/owner/get_by_id/' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        }
    }
  )
  if(!res.ok) {
      return null
  }
  const data = await res.json()
  return data
}

async function getUserList() {
  const users = await userList();
  return users;
}


export default async function Page({ params }: { params: { id: string } }) {
  const taskData = await getData(params.id);
  const ownerData = await getOwnerData(taskData["owner_id"]);
  const logs = await LogList(params.id)

  const logItems = logs.map((row, index) => {
    const icon = row["record_type"] === "action" ? (
      <svg className="h-8 w-8 print:h-4 print:w-4 text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
      </svg>
    ) : row["record_type"] === "comment" ? (
      <svg className="h-8 w-8 print:h-4 print:w-4 text-gray-400"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>
        <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />  <line x1="8" y1="9" x2="16" y2="9" />  <line x1="8" y1="13" x2="14" y2="13" />
      </svg>
    ) : ""

    const creationDate = new Date(row["creation_date"]);
    const creationDateFormatted = creationDate.toLocaleDateString(
      'de-DE', 
      {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }
    );

    const commentClass = row["record_type"] === "action" ? "w-full font-thin" : "w-full";

    return (
      <div className="w-full py-1 mb-1 border-b" key={index}>
        <div className="flex flex-row items-start space-x-4">
          <div className="">
            {icon}
          </div>
          <div className={commentClass}>{row["comment"]}</div>
          <div className="text-right w-1/4 print:w-1/3 font-thin">{row["supervisor_name"]} / {creationDateFormatted}</div>
        </div>
      </div>
    )
  })
  const userList = await getUserList();
  const userID = await getUserID();

  return (
    <>
    {taskData ? (
      <>
        <TaskCard
        data={taskData}
        clickable={false}/>
        <div className="flex flex-row space-x-4 screen:hidden">
          <div className="w-1/2"></div>
          <div className="screen:border-2 border-gray-300 mb-4 rounded-lg w-1/2 overflow-hidden">
            <div className="flex items-start">
              <div className="font-thin bg-slate-200 px-2 rounded-tl-md rounded-br-md print:mb-2 print:w-full">QR-Code</div>
              <div className="flex-auto"></div>
            </div>
            <div className="p-4 print:p-1 w-full flex flex-row">
              <div className="flex-auto"></div>
              <img className="w-24 h-24 rounded-md" src="https://reparaturcafe-dev.it-awo.de/fastapi/qrcode/create?task_id=1000"></img>
              <div className="flex-auto"></div>
            </div>
          </div>
        </div>
        <div className="flex screen:flex-row space-x-4">
          <TaskDeviceArea 
          taskID={params.id}
          currentDeviceName={taskData["device_name"]}
          currentDeviceManufacturer={taskData["device_manufacturer"]}
          currentDeviceModel={taskData["device_model"]}
          currentDeviceErrorDescription={taskData["device_error_description"]}/>
          <TaskOwnerArea
          taskID={params.id}
          currentOwnerID={ownerData ? ownerData["id"] : null}
          currentOwnerLastName={ownerData ? ownerData["last_name"] : ""}
          currentOwnerFirstName={ownerData ? ownerData["first_name"] : ""}
          currentOwnerPhone={ownerData ? ownerData["phone"] : ""}
          currentOwnerEmail={ownerData ? ownerData["email"] : ""}
          currentOwnerStreet={ownerData ? ownerData["street"] : ""}
          currentOwnerStreetNo={ownerData ? ownerData["street_no"] : ""}
          currentOwnerZip={ownerData ? ownerData["zip"] : ""}
          />
        </div>
        <div className="flex flex-row space-x-4">
          <TaskLocationArea 
            taskID={params.id}
            taskShelfNo={taskData["shelf_no"]}
            taskShelfFloorNo={taskData["shelf_floor_no"]}
            taskOtherLocation={taskData["other_location"]}
          />
          <TaskStateArea
            taskID={params.id}
            taskCreationDate={taskData["creation_date"]}
            taskSupervisorID={taskData["supervisor_id"]}
            taskSupervisorName={taskData["supervisor_name"]}
            taskState={taskData["task_state"]}
            userList={userList}
          />
        </div>


        <div className="mb-4 rounded-lg w-full overflow-hidden screen:hidden">
          <div className="flex flex-col items-start pb-4">
            <div className="font-thin bg-slate-200 px-2 rounded-tl-md rounded-br-md print:mb-2 print:w-full">Unterschriften</div>
            <div className="flex flex-col space-y-8 w-full p-2">
              <div>
                <h4 className="label w-full">Hausordnung / Haftungsbegrenzung / Datenschutzerklärung gelesen und verstanden:</h4>
                <div className="flex flex-row w-full space-x-4 ml-10">
                  <div className="w-1/3 border-b-2 p-2">Troisdorf, den</div>
                  <div className="w-2/3 border-b-2 p-2">X</div>
                </div>
              </div>
              <div>
                <h4 className="label w-full">Gerät abgeholt:</h4>
                <div className="flex flex-row w-full space-x-4 ml-10">
                  <div className="w-1/3 border-b-2 p-2">Troisdorf, den</div>
                  <div className="w-2/3 border-b-2 p-2">X</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="screen:border-2 border-gray-300 mb-4 rounded-lg w-full overflow-hidden break-inside-avoid">
          <div className="flex flex-col items-start pb-4">
            <div className="font-thin bg-slate-200 px-2 rounded-tl-md rounded-br-md print:mb-2 print:w-full">Verlauf</div>
            <div className="p-4 print:p-2 w-full">
              <div className="flex flex-col w-full mt-4">
                {logItems}
              </div>
              <CommentForm 
                supervisorID={userID}
                taskID={params.id}
                />
            </div>
          </div>
        </div>
      </>
    ) : "loading..."}
    </>
  )
}