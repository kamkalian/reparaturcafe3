'use client'

import { useState } from "react";
import React from "react";
import OwnerForm from "./OwnerForm";
import EditButton from "./EditButton";


interface Props {
  taskID: string,
  currentOwnerID?: string,
  currentOwnerLastName?: string,
  currentOwnerFirstName?: string,
  currentOwnerPhone?: string,
  currentOwnerEmail?: string,
  currentOwnerStreet?: string,
  currentOwnerStreetNo?: string,
  currentOwnerZip?: string
}


export default function TaskOwnerArea(props: Props) {
  const [editOwnerFormOpen, setEditOwnerFormOpen] = useState(false);
  
  const handleEditButtonClick = () => {
    setEditOwnerFormOpen(!editOwnerFormOpen);
  }

  const handleCloseOwnerForm = () => {
    setEditOwnerFormOpen(false);
  }
  
  return(
    <div className="screen:border-2 border-gray-300 p-4 mb-4 rounded-md w-1/2">
      <div className="flex items-start">
        <div className="flex-auto font-bold">Kontaktdaten</div>
        <EditButton
          handleEditButtonClick={handleEditButtonClick}
        />
      </div>
      {editOwnerFormOpen ? (
        <>
          <OwnerForm
          taskID={props.taskID}
          currentOwnerID={props.currentOwnerID}
          currentOwnerLastName={props.currentOwnerLastName}
          currentOwnerFirstName={props.currentOwnerFirstName}
          currentOwnerPhone={props.currentOwnerPhone}
          currentOwnerEmail={props.currentOwnerEmail}
          currentOwnerStreet={props.currentOwnerStreet}
          currentOwnerStreetNo={props.currentOwnerStreetNo}
          currentOwnerZip={props.currentOwnerZip}
          handleCloseOwnerForm={handleCloseOwnerForm}
          />
        </>
      ) : (
        <>
          <div className="flex flex-row">
            <div className="m-4 w-1/2">
              <h4 className="font-thin">Nachname</h4>
              <p>{props.currentOwnerLastName ? props.currentOwnerLastName : "-"}</p>
            </div>
            <div className="m-4 w-1/2">
              <h4 className="font-thin">Vorname</h4>
              <p>{props.currentOwnerFirstName ? props.currentOwnerFirstName : "-"}</p>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="m-4 w-1/2">
              <h4 className="font-thin">Telefon</h4>
              <p>{props.currentOwnerPhone ? props.currentOwnerPhone : "-"}</p>
            </div>
            <div className="m-4 w-1/2">
              <h4 className="font-thin">Email</h4>
              <p>{props.currentOwnerEmail ? props.currentOwnerEmail : "-"}</p>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="m-4 w-1/2">
              <h4 className="font-thin">Straße, Hausnr.</h4>
              <p>{props.currentOwnerStreet ? props.currentOwnerStreet : "-"}, {props.currentOwnerStreetNo ? props.currentOwnerStreetNo : "-"}</p>
            </div>
            <div className="m-4 w-1/2">
              <h4 className="font-thin">PLZ, Ort</h4>
              <p>{props.currentOwnerZip ? props.currentOwnerZip : "-"}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}