'use client'
 
import { useRouter } from 'next/navigation'
import { createTask } from "@/server/task-create"
import React from "react";
import { updateTaskDevice } from '@/server/task-device-update';
import { useSnackbar, type ProviderContext } from 'notistack';
import { createRecord } from '@/server/record-create';


interface Props {
  supervisorID: string,
  taskID?: string
}


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


export default function CommentForm(props: Props) {
  const [comment, setComment] = React.useState("");
  const router = useRouter();

  const snackbarContext = useSnackbar();

  const handleSaveButtonClick = async () => {  
    await createRecord(
      props.supervisorID,
      props.taskID,
      comment,
      "comment"
    )
    setComment("")
    enqeueSuccessfulNotification("Kommentar gespeichert.", snackbarContext);
    router.push('/task/' + props.taskID)
  }

  const handleCommentChange = (value: string) => {
    setComment(value);
  }

  return(
    <div className="border-2 border-white rounded-lg mt-4 flex-col w-full content-end print:hidden">
      <form className="flex-col w-full">        
        <div className="w-full p-3">
          <label htmlFor="device-error-description" className="block mb-2 text-black font-thin">Kommentar</label>
          <textarea
            id="device-error-description"
            rows={4}
            className="block p-2.5 w-full text-gray-900 bg-white rounded-lg border border-gray-300"
            value={comment}
            onChange={(event) => {
              handleCommentChange(event.target.value);
            }}
            ></textarea>
        </div>
      </form>
      <div className="w-full px-3">
        <button 
        className="bg-button-active text-white rounded-lg p-3 w-full"
        onClick={handleSaveButtonClick}
        >Speichern</button>
      </div>
    </div>
  )
}