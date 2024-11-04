"use client";

import React from "react";
import { updateTaskState } from '@/server/task-state-update';
import { updateTaskSupervisor } from '@/server/task-supervisor-update';
import { useSnackbar, type ProviderContext } from 'notistack';
import { useRouter } from 'next/navigation'
import { getUserID } from "@/server/auth";
import { createRecord } from "@/server/record-create";


interface Props {
  taskID: string,
  taskCreationDate: string,
  taskSupervisorID: number,
  taskSupervisorName: string,
  taskState: string,
  userList,
}


export default function TaskStateArea(props: Props) {

  const router = useRouter();
  const snackbarContext = useSnackbar();

  const enqeueSuccessfulNotification = (
    msg: string,
    { enqueueSnackbar }: ProviderContext
  ): void => {
    enqueueSnackbar(
      <div className='text-xl font-bold'>
        {msg}
      </div>, {
      variant: "success",
      persist: false,
      anchorOrigin: {horizontal: "right", vertical: "bottom"},
    });
  }
  
  const buttonNew = () => {
    const baseClass = "flex items-center justify-center w-32 h-10 rounded-md text-white shrink-0"
    const hover = props.taskState !== "new" ? "hover:bg-button-active" : ""
    const highlight = props.taskState === "new" ? "bg-yellow-600/75" : "bg-button-inactive"
  
    return(
      <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-gray-300">
        <button 
          className={baseClass + " " + hover + " " + highlight}
          onClick={async () => {
            updateTaskState("new", props.taskID)
            const userID = await getUserID();
            await createRecord(
              userID,
              props.taskID,
              "Status auf 'Neu' geändert.",
              "action"
            )
            enqeueSuccessfulNotification("Status geändert.", snackbarContext);
            router.push('/task/' + props.taskID);
          }
          }
        >
            Neu
        </button>
      </li>
    )
  }

  const buttonInProcess = () => {
    const baseClass = "flex items-center justify-center w-32 h-10 rounded-md text-white shrink-0"
    const hover = props.taskState !== "in_process" ? "hover:bg-button-active" : ""
    const highlight = props.taskState === "in_process" ? "bg-green-600/75" : "bg-button-inactive"
  
    return(
      <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-gray-300">
        <button
          className={baseClass + " " + hover + " " + highlight}
          onClick={async () => {
            updateTaskState("in_process", props.taskID)
            const userID = await getUserID();
            await createRecord(
              userID,
              props.taskID,
              "Status auf 'In Arbeit' geändert.",
              "action"
            )
            enqeueSuccessfulNotification("Status geändert.", snackbarContext);
            router.push('/task/' + props.taskID);
          }
          }
          >
            In Arbeit
        </button>
      </li>
    )
  }

  const buttonDone = () => {
    const baseClass = "flex items-center justify-center w-32 h-10 rounded-md text-white shrink-0"
    const hover = props.taskState !== "done" ? "hover:bg-button-active" : ""
    const highlight = props.taskState === "done" ? "bg-blue-600/75" : "bg-button-inactive"
  
    return(
      <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-gray-300">
        <button
          className={baseClass + " " + hover + " " + highlight}
          onClick={async () => {
            updateTaskState("done", props.taskID)
            const userID = await getUserID();
            await createRecord(
              userID,
              props.taskID,
              "Status auf 'Fertig' geändert.",
              "action"
            )
            enqeueSuccessfulNotification("Status geändert.", snackbarContext);
            router.push('/task/' + props.taskID);
          }
          }
          >
            Fertig
        </button>
      </li>
    )
  }

  const buttonCompleted = () => {
    const baseClass = "flex items-center justify-center w-40 h-10 rounded-md text-white shrink-0"
    const hover = props.taskState !== "completed" ? "hover:bg-button-active" : ""
    const highlight = props.taskState === "completed" ? "bg-gray-600/75 border-4 border-gray-700" : "bg-button-inactive"
  
    return(
      <li className="flex w-full items-center">
        <button
          className={baseClass + " " + hover + " " + highlight}
          onClick={ async() => {
            updateTaskState("completed", props.taskID)
            const userID = await getUserID();
            await createRecord(
              userID,
              props.taskID,
              "Status auf 'Abgeschlossen' geändert.",
              "action"
            )
            enqeueSuccessfulNotification("Status geändert.", snackbarContext);
            router.push('/task/' + props.taskID);
          }
          }
          >
            Abgeschlossen
        </button>
      </li>
    )
  }

  const userOptions = props.userList.map((row, index) => {
    return (
      <option
        value={row["id"]}
        key={index}
      >{row["username"]}</option>
    )
  })

  const handleSupervisorChange = async (value: string, username: string) => {
    updateTaskSupervisor(value, props.taskID);
    const userID = await getUserID();
    await createRecord(
      userID,
      props.taskID,
      "Bearbeiter zu '" + username + "' geändert.",
      "action"
    )
    enqeueSuccessfulNotification("Bearbeiter geändert.", snackbarContext);
    router.push('/task/' + props.taskID);
  }

  const creationDate = new Date(props.taskCreationDate);
  const creationDateFormatted = creationDate.toLocaleDateString(
    'de-DE', 
    {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    }
  );
  
  return(
    <div className="screen:border-2 border-gray-300 mb-4 rounded-lg overflow-hidden screen:w-1/2 print:w-full">
      <div className="flex flex-col items-start">
      <div className="font-thin bg-slate-200 px-2 rounded-tl-md rounded-br-md print:mb-2 print:w-full">Status</div>
      <div className="flex-auto"></div>
        <div className="flex flex-col w-full p-4 mt-4 print:hidden">
          <ol className="flex items-center w-full">
              {buttonNew()}
              {buttonInProcess()}
              {buttonDone()}
              {buttonCompleted()}
          </ol>
        </div>
        <div className="flex flex-row w-full">
          <div className="screen:m-4 print:p-2 w-1/2">
            <h4 className="label">Erstelldatum</h4>
            <p>{creationDateFormatted ? creationDateFormatted : "-"}</p>
          </div>
          <div className="screen:m-4 print:p-2 w-1/2">
            <label htmlFor="users" className="block label">Bearbeiter</label>
            <select
              id="users"
              className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-1"
              onChange={(event) => {
                const username = props.userList.find((option) => option.id.toString() === event.target.value);
                handleSupervisorChange(event.target.value, username.username);
              }}
              defaultValue={props.taskSupervisorID}>
              {userOptions}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}