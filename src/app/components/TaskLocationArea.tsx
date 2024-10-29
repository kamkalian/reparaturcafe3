"use client";

import React, { useState } from "react";
import { useSnackbar, type ProviderContext } from 'notistack';
import { useRouter } from 'next/navigation'
import EditButton from "./EditButton";
import LocationForm from "./LocationForm";


interface Props {
  taskID: string,
  taskShelfNo: string,
  taskShelfFloorNo: string,
  taskOtherLocation: string,
}


export default function TaskLocationArea(props: Props) {
  const [editLocationFormOpen, setEditLocationFormOpen] = useState(false);
  
  const handleEditButtonClick = () => {
    setEditLocationFormOpen(!editLocationFormOpen);
  }

  const handleCloseLocationForm = () => {
    setEditLocationFormOpen(false);
  }

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
  

  return(
    <div className="screen:border-2 border-gray-300 mb-4 rounded-lg screen:w-1/2 print:w-full">
      <div className="flex items-start">
        <div className="font-thin bg-slate-200 px-2 rounded-tl-md rounded-br-md print:mb-2 print:w-full">Lagerort</div>
        <div className="flex-auto"></div>
        <EditButton
          handleEditButtonClick={handleEditButtonClick}
          corner={true}
        />
      </div>
      <div className="p-4 print:p-2">
        { editLocationFormOpen ? (
          <LocationForm
            currentTaskShelfNo={props.taskShelfNo}
            currentTaskShelfFloorNo={props.taskShelfFloorNo}
            currentTaskOtherLocation={props.taskOtherLocation}
            handleCloseLocationForm={handleCloseLocationForm}
            taskID={props.taskID}
          />
        ) : (
          <div className="flex flex-row space-x-4 items-start">
            <div className="w-1/4">
              <h4 className="label">Schrank</h4>
              <p>{props.taskShelfNo ? props.taskShelfNo : "-"}</p>
            </div>
            <div className="w-1/4">
              <h4 className="label">Fach</h4>
              <p>{props.taskShelfFloorNo ? props.taskShelfFloorNo : "-"}</p>
            </div>
            <div className="w-1/2">
              <h4 className="label">Anderer Ort</h4>
              <p>{props.taskOtherLocation ? props.taskOtherLocation : "-"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}