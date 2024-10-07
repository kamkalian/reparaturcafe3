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
    <div className="screen:border-2 border-gray-300 p-4 mb-4 rounded-md">
      <div className="flex items-start">
        <div className="w-full font-bold">Lagerort</div>
        <EditButton
          handleEditButtonClick={handleEditButtonClick}
        />
      </div>
      { editLocationFormOpen ? (
        <LocationForm
          currentTaskShelfNo={props.taskShelfNo}
          currentTaskShelfFloorNo={props.taskShelfFloorNo}
          currentTaskOtherLocation={props.taskOtherLocation}
          handleCloseLocationForm={handleCloseLocationForm}
          taskID={props.taskID}
        />
      ) : (
        <div className="flex flex-row">
          <div className="m-4 w-1/3">
            <h4 className="font-thin">Schrank</h4>
            <p>{props.taskShelfNo ? props.taskShelfNo : "-"}</p>
          </div>
          <div className="m-4 w-1/3">
            <h4 className="font-thin">Fach</h4>
            <p>{props.taskShelfFloorNo ? props.taskShelfFloorNo : "-"}</p>
          </div>
          <div className="m-4 w-1/3">
            <h4 className="font-thin">Anderer Ort</h4>
            <p>{props.taskOtherLocation ? props.taskOtherLocation : "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
}