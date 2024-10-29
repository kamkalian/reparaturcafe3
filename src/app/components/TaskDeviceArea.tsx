"use client";

import { useState, useEffect } from "react";
import React from "react";
import DeviceForm from "./DeviceForm";
import EditButton from "./EditButton";


interface Props {
  taskID: string,
  currentDeviceName?: string,
  currentDeviceManufacturer?: string,
  currentDeviceModel?: string,
  currentDeviceErrorDescription?: string
}


export default function TaskDeviceArea(props: Props) {
  const [editDeviceFormOpen, setEditDeviceFormOpen] = useState(false);

  useEffect(() => {
    
  }, [])
  
  const handleEditButtonClick = () => {
    setEditDeviceFormOpen(!editDeviceFormOpen);
  }

  const handleCloseDeviceForm = () => {
    setEditDeviceFormOpen(false);
  }
  
  return(
    <div className="screen:border-2 border-gray-300 mb-4 rounded-lg screen:w-1/2 print:w-full overflow-hidden">
      <div className="flex items-start">
        <div className="font-thin bg-slate-200 px-2 rounded-tl-md rounded-br-md print:mb-2 print:w-full">Gerätedaten</div>
        <div className="flex-auto"></div>
        <EditButton
          handleEditButtonClick={handleEditButtonClick}
          corner={true}
        />
      </div>
      <div className="p-4 print:p-2">
        {editDeviceFormOpen ? (
          <>
            <DeviceForm
            taskID={props.taskID}
            currentDeviceName={props.currentDeviceName}
            currentDeviceManufacturer={props.currentDeviceManufacturer}
            currentDeviceModel={props.currentDeviceModel}
            currentDeviceErrorDescription={props.currentDeviceErrorDescription}
            new_or_edit="edit"
            handleCloseDeviceForm={handleCloseDeviceForm}
            />
          </>
        ) : (
          <>
            <div className="flex flex-row space-x-4 w-full">
              <h4 className="label w-20 print:w-14">Hersteller</h4>
              <div className="w-10 print:w-4 text-center">:</div>
              <p className="">{props.currentDeviceManufacturer ? props.currentDeviceManufacturer : "-"}</p>
            </div>
            <div className="flex flex-row space-x-4 overflow-hidden">
              <h4 className="label w-20 print:w-14">Modell</h4>
              <p className="w-10 print:w-4 text-center">:</p>
              <p className="">{props.currentDeviceModel ? props.currentDeviceModel : "-"}</p>
            </div>
            <div className="flex flex-col w-full">
              <h4 className="label w-full mt-4">Fehlerbeschreibung</h4>
              <p className="w-full">{props.currentDeviceErrorDescription ? props.currentDeviceErrorDescription : "-"}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}