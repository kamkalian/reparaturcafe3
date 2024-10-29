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
    <div className="flex flex-col w-full space-y-6">

      <div className="flex flex-row w-full">
        <div className="w-1/3">
          <label htmlFor="device-name" className="label">Schrank Nr.</label>
        </div>
        <div className="w-2/3">
          <input 
            type="text"
            id="device-name"
            className="input w-full"
            value={taskShelfNo}
            onChange={(event) => {
              handleTaskShelfNoChange(event.target.value);
            }}
            />
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="w-1/3">
          <label htmlFor="manufacturer" className="label">Fach Nr.</label>
        </div>
        <div className="w-2/3">
          <input
            type="text"
            id="manufacturer"
            className="input w-full"
            value={taskShelfFloorNo}
            onChange={(event) => {
              handleTaskShelfFloorNoChange(event.target.value);
            }}
            />
          </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="w-1/3">
          <label htmlFor="model" className="label">Anderer Ort</label>
        </div>
        <div className="w-2/3">
          <input
            type="text"
            id="model"
            className="input w-full"
            value={taskOtherLocation}
            onChange={(event) => {
              handleTaskOtherLocationChange(event.target.value);
            }}
            />
        </div>
      </div>

      <div className="w-full p-3">
        <button 
        className="bg-button-active text-white rounded-lg p-3 w-full"
        onClick={handleSaveButtonClick}
        >Speichern</button>
      </div>
    </div>
  )
}