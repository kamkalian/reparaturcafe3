'use client'
 
import { useRouter } from 'next/navigation'
import { createTask } from "@/server/task-create"
import React from "react";
import { updateTaskDevice } from '@/server/task-device-update';
import { useSnackbar, type ProviderContext } from 'notistack';
import { createRecord } from '@/server/record-create';
import { getUserID } from '@/server/auth';


interface Props {
  currentDeviceName?: string,
  currentDeviceManufacturer?: string,
  currentDeviceModel?: string,
  currentDeviceErrorDescription?: string,
  new_or_edit: string,
  taskID?: string,
  handleCloseDeviceForm?: any
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


export default function DeviceForm(props: Props) {
  const [deviceName, setDeviceName] = React.useState(props.currentDeviceName);
  const [deviceManufacturer, setDeviceManufacturer] = React.useState(props.currentDeviceManufacturer);
  const [deviceModel, setDeviceModel] = React.useState(props.currentDeviceModel);
  const [deviceErrorDescription, setDeviceErrorDescription] = React.useState(props.currentDeviceErrorDescription);
  const [deviceNameMissing, setDeviceNameMissing] = React.useState(Boolean);
  const router = useRouter();

  const snackbarContext = useSnackbar();

  const handleSaveButtonClick = async () => {
    const handleCloseDeviceForm = props.handleCloseDeviceForm;
    
    
    if(deviceName === undefined || deviceName === ""){
      setDeviceNameMissing(true);
    }else{
      setDeviceNameMissing(false)

      if(props.new_or_edit === "new"){
        const newTaskID = await createTask(
          deviceName,
          deviceErrorDescription,
          deviceManufacturer,
          deviceModel
        );
        setDeviceName("");
        setDeviceManufacturer("");
        setDeviceModel("");
        setDeviceErrorDescription("");

        enqeueSuccessfulNotification("Gerät neu angelegt.", snackbarContext);
        router.push('/task/' + newTaskID)
      }else if(props.new_or_edit === "edit"){
        const newTaskData = await updateTaskDevice(
          props.taskID,
          deviceName,
          deviceErrorDescription,
          deviceManufacturer,
          deviceModel
        )
        handleCloseDeviceForm();

        const userID = await getUserID();
        await createRecord(
          userID,
          props.taskID,
          "Gerätedaten geändert.",
          "action"
        )

        enqeueSuccessfulNotification("Gerätedaten gespeichert.", snackbarContext);

        router.push('/task/' + props.taskID);
      }
    }
  }

  const handleDeviceNameChange = (value: string) => {
    setDeviceName(value);
  }

  const handleDeviceManufacturerChange = (value: string) => {
    setDeviceManufacturer(value);
  }

  const handleDeviceModelChange = (value: string) => {
    setDeviceModel(value);
  }

  const handleDeviceErrorDescriptionChange = (value: string) => {
    setDeviceErrorDescription(value);
  }

  return(
    <div className="border-2 border-white rounded-lg mt-4 flex-col w-full">
      <form className="flex-col w-full">
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="device-name" className="block mb-2 text-black font-thin">Gerätebezeichnung</label>
          <input 
            type="text"
            id="device-name"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={deviceName}
            onChange={(event) => {
              handleDeviceNameChange(event.target.value);
            }}
            />
          {deviceNameMissing ? (
            <p className="mt-2 font-bold text-red-600 dark:text-red-500">Bitte Gerätebezeichnung angeben!</p>
          ) : ""}
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="manufacturer" className="block mb-2 text-black font-thin">Hersteller</label>
          <input
            type="text"
            id="manufacturer"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={deviceManufacturer}
            onChange={(event) => {
              handleDeviceManufacturerChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="model" className="block mb-2 text-black font-thin">Modell</label>
          <input
            type="text"
            id="model"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={deviceModel}
            onChange={(event) => {
              handleDeviceModelChange(event.target.value);
            }}
            />
        </div>
        <div className="w-full p-3">
          <label htmlFor="device-error-description" className="block mb-2 text-black font-thin">Fehlerbeschreibung</label>
          <textarea
            id="device-error-description"
            rows={4}
            className="block p-2.5 w-full text-gray-900 bg-white rounded-lg border border-gray-300"
            value={deviceErrorDescription}
            onChange={(event) => {
              handleDeviceErrorDescriptionChange(event.target.value);
            }}
            ></textarea>
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