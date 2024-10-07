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
      <svg className="h-8 w-8 text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
      </svg>
    ) : row["record_type"] === "comment" ? (
      <svg className="h-8 w-8 text-gray-400"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>
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
      <div className="" key={index}>
        <div className="flex flex-row items-start px-4 space-x-4">
          <div className="">
            {icon}
          </div>
          <div className={commentClass}>{row["comment"]}</div>
        </div>
        <div className="text-right w-full font-thin">{row["supervisor_name"]} / {creationDateFormatted}</div>
        <hr className="my-4"/>
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
        <div className="flex flex-row space-x-4">
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
          <div className="flex w-1/2">
            <div className="screen:border-2 border-gray-300 p-4 mb-4 rounded-md w-full">
              <div className="flex-auto font-bold mb-6">Verlauf</div>
              <div className="flex flex-col">
                {logItems}
              </div>
              <CommentForm 
                supervisorID={userID}
                taskID={params.id}

                />
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <TaskStateArea
              taskID={params.id}
              taskCreationDate={taskData["creation_date"]}
              taskSupervisorID={taskData["supervisor_id"]}
              taskSupervisorName={taskData["supervisor_name"]}
              taskState={taskData["task_state"]}
              userList={userList}
            />
            <TaskLocationArea 
              taskID={params.id}
              taskShelfNo={taskData["shelf_no"]}
              taskShelfFloorNo={taskData["shelf_floor_no"]}
              taskOtherLocation={taskData["other_location"]}
            />
          </div>
        </div>
      </>
    ) : "loading..."}
    </>
  )
}