'use client'
 
import { useRouter } from 'next/navigation'
import React from "react";
import { useSnackbar, type ProviderContext } from 'notistack';
import { updateLocation } from '@/server/location-update';
import { getUserID } from '@/server/auth';
import { createRecord } from '@/server/record-create';


interface Props {
  currentTaskShelfNo?: string,
  currentTaskShelfFloorNo?: string,
  currentTaskOtherLocation?: string,
  taskID?: string,
  handleCloseLocationForm?: any
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


export default function LocationForm(props: Props) {
  const [taskShelfNo, setTaskShelfNo] = React.useState(props.currentTaskShelfNo);
  const [taskShelfFloorNo, setTaskShelfFloorNo] = React.useState(props.currentTaskShelfFloorNo);
  const [taskOtherLocation, setTaskOtherLocation] = React.useState(props.currentTaskOtherLocation)
  const router = useRouter();

  const snackbarContext = useSnackbar();

  const handleSaveButtonClick = async () => {
    const handleCloseLocationForm = props.handleCloseLocationForm;
    
    updateLocation(
      taskShelfNo,
      taskShelfFloorNo,
      taskOtherLocation,
      props.taskID
    )

    handleCloseLocationForm();

    const userID = await getUserID();
    await createRecord(
      userID,
      props.taskID,
      "Lagerort geändert.",
      "action"
    )

    enqeueSuccessfulNotification("Lagerort gespeichert.", snackbarContext);

    router.push('/task/' + props.taskID);
    
  }

  const handleTaskShelfNoChange = (value: string) => {
    setTaskShelfNo(value);
  }

  const handleTaskShelfFloorNoChange = (value: string) => {
    setTaskShelfFloorNo(value);
  }

  const handleTaskOtherLocationChange = (value: string) => {
    setTaskOtherLocation(value);
  }


  return(
    <div className="border-2 border-white rounded-lg mt-4 flex-col w-full">
      <form className="flex-col w-full">
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="device-name" className="block mb-2 text-black font-thin">Schrank Nr.</label>
          <input 
            type="text"
            id="device-name"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={taskShelfNo}
            onChange={(event) => {
              handleTaskShelfNoChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="manufacturer" className="block mb-2 text-black font-thin">Fach Nr.</label>
          <input
            type="text"
            id="manufacturer"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={taskShelfFloorNo}
            onChange={(event) => {
              handleTaskShelfFloorNoChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="model" className="block mb-2 text-black font-thin">Anderer Ort</label>
          <input
            type="text"
            id="model"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={taskOtherLocation}
            onChange={(event) => {
              handleTaskOtherLocationChange(event.target.value);
            }}
            />
        </div>
        
      </form>
      <div className="w-full p-3">
        <button 
        className="bg-button-active text-white rounded-lg p-3 w-full"
        onClick={handleSaveButtonClick}
        >Speichern</button>
      </div>
    </div>
  )
}