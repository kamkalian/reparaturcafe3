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

  const mailtoLink = () => {
    if(props.currentOwnerEmail){
      return "mailto:" + props.currentOwnerEmail;
    }
    return ""
  }
  
  return(
    <div className="screen:border-2 border-gray-300 mb-4 rounded-lg screen:w-1/2 print:w-full overflow-hidden">
      <div className="flex items-start">
        <div className="font-thin bg-slate-200 px-2 rounded-tl-md rounded-br-md print:mb-2 print:w-full">Kontaktdaten</div>
        <div className="flex-auto"></div>
        <EditButton
          handleEditButtonClick={handleEditButtonClick}
          corner={true}
        />
      </div>
      <div className="p-4 print:p-1">
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
              <h4 className="label w-40 print:w-14">Name</h4>
              <div className="w-10 print:w-4 text-center">:</div>
              <p>{props.currentOwnerLastName ? props.currentOwnerLastName : "-"}, {props.currentOwnerFirstName ? props.currentOwnerFirstName : "-"}
              </p>
            </div>
            <div className="flex flex-row">
              <h4 className="label w-40 print:w-14">Telefon</h4>
              <div className="w-10 print:w-4 text-center">:</div>
              <p>{props.currentOwnerPhone ? props.currentOwnerPhone : "-"}</p>
            </div>
            <div className="flex flex-row">
              <h4 className="label w-40 print:w-14">Email</h4>
              <div className="w-10 print:w-4 text-center">:</div>
              <p>{props.currentOwnerEmail ? (
                <a href={mailtoLink()} className="text-blue-700 underline">
                {props.currentOwnerEmail}
                </a>
                ) : "-"}</p>
            </div>
            <div className="flex flex-row print:flex-col print:my-4">
              <h4 className="label w-40 print:w-full">Straße, Hausnr.</h4>
              <div className="w-10 print:w-full text-center print:hidden">:</div>
              <p className="print:w-full">{props.currentOwnerStreet ? props.currentOwnerStreet : "-"}, {props.currentOwnerStreetNo ? props.currentOwnerStreetNo : "-"}</p>
            </div>
            <div className="flex screen:flex-row">
              <h4 className="label w-40 print:w-14">PLZ</h4>
              <div className="w-10 print:w-4 text-center">:</div>
              <p>{props.currentOwnerZip ? props.currentOwnerZip : "-"}</p>
            </div>

          </>
        )}
      </div>
    </div>
  );
}