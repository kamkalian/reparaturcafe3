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
    <div className="screen:border-2 border-gray-300 p-4 mb-4 rounded-md w-1/2">
      <div className="flex items-start">
        <div className="flex-auto font-bold">Gerätedaten</div>
        <EditButton
          handleEditButtonClick={handleEditButtonClick}
        />
      </div>
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
          <div className="flex flex-row">
            <div className="m-4 w-1/2">
              <h4 className="font-thin">Hersteller</h4>
              <p>{props.currentDeviceManufacturer ? props.currentDeviceManufacturer : "-"}</p>
            </div>
            <div className="m-4 w-1/2">
              <h4 className="font-thin">Modell</h4>
              <p>{props.currentDeviceModel ? props.currentDeviceModel : "-"}</p>
            </div>
          </div>
          <div className="m-4">
            <h4 className="font-thin">Fehlerbeschreibung</h4>
            <p>{props.currentDeviceErrorDescription ? props.currentDeviceErrorDescription : "-"}</p>
          </div>
        </>
      )}
    </div>
  );
}