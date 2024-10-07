'use client'

import { useRouter } from 'next/navigation'
import { createTask } from "@/server/task-create"
import React, { useEffect } from "react";
import { updateTaskDevice } from '@/server/task-device-update';
import { useSnackbar, type ProviderContext } from 'notistack';
import { searchOwner } from '@/server/owner-search';
import internal from 'stream';
import { updateOwner } from '@/server/owner-update';
import { updateTaskOwner } from '@/server/task-owner-update';
import { createOwner } from '@/server/owner-create';
import { getUserID } from '@/server/auth';
import { createRecord } from '@/server/record-create';


interface Props {
  currentOwnerID?: string,
  currentOwnerLastName?: string,
  currentOwnerFirstName?: string,
  currentOwnerPhone?: string,
  currentOwnerEmail?: string,
  currentOwnerStreet?: string,
  currentOwnerStreetNo?: string,
  currentOwnerZip?: string,
  taskID?: string,
  handleCloseOwnerForm?: any
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


export default function OwnerForm(props: Props) {
  const [ownerID, setOwnerID] = React.useState(props.currentOwnerID);
  const [ownerLastName, setOwnerLastName] = React.useState(props.currentOwnerLastName);
  const [ownerFirstName, setOwnerFirstName] = React.useState(props.currentOwnerFirstName);
  const [ownerPhone, setOwnerPhone] = React.useState(props.currentOwnerPhone);
  const [ownerEmail, setOwnerEmail] = React.useState(props.currentOwnerEmail ? props.currentOwnerEmail : "");
  const [ownerStreet, setOwnerStreet] = React.useState(props.currentOwnerStreet);
  const [ownerStreetNo, setOwnerStreetNo] = React.useState(props.currentOwnerStreetNo);
  const [ownerZip, setOwnerZip] = React.useState(props.currentOwnerZip);
  const [ownerSearchResultList, setOwnerSearchResultList] = React.useState(Array);
  const [ownerNameMissing, setOwnerNameMissing] = React.useState(false);
  const router = useRouter();

  const snackbarContext = useSnackbar();

  const handleSaveButtonClick = async () => {
    const handleCloseOwnerForm = props.handleCloseOwnerForm;

    if(ownerID === null || ownerID === ""){

      if(ownerLastName === ""){
        setOwnerNameMissing(true);
        return false;
      }

      // Kontakt neu anlegen und zuordnen
      const newOwnerID = await createOwner(
        ownerLastName,
        ownerFirstName,
        ownerPhone,
        ownerEmail === "" ? null : ownerEmail,
        ownerStreet,
        ownerStreetNo,
        ownerZip
      )

      await updateTaskOwner(newOwnerID, props.taskID)

      const userID = await getUserID();
      await createRecord(
        userID,
        props.taskID,
        "Kontakt neu angelegt.",
        "action"
      )
      
      enqeueSuccessfulNotification("Kontakt neu angelegt und zugeordnet.", snackbarContext);

    }else{

      if(ownerLastName === ""){
        setOwnerNameMissing(true);
        return false;
      }

      await updateOwner(
        ownerID,
        ownerLastName,
        ownerFirstName,
        ownerPhone,
        ownerEmail === "" ? null : ownerEmail,
        ownerStreet,
        ownerStreetNo,
        ownerZip
      )

      const userID = await getUserID();
      await createRecord(
        userID,
        props.taskID,
        "Kontaktdaten geändert.",
        "action"
      )

      enqeueSuccessfulNotification("Kontaktdaten gespeichert.", snackbarContext);

      // Zuordnung der Owner ID
      await updateTaskOwner(ownerID, props.taskID)
      enqeueSuccessfulNotification("Kontakt neu zugeordnet.", snackbarContext);

    }
    handleCloseOwnerForm();
    
    router.push('/task/' + props.taskID);    
  }

  const handleRemoveOwnerLinkButtonClick = async () => {
    const handleCloseOwnerForm = props.handleCloseOwnerForm;

    setOwnerID("")
    await updateTaskOwner(null, props.taskID)

    const userID = await getUserID();
      await createRecord(
        userID,
        props.taskID,
        "Kontakt entfernt.",
        "action"
      )

    enqeueSuccessfulNotification("Kontakt entfernt.", snackbarContext);
    handleCloseOwnerForm();
    router.push('/task/' + props.taskID);
  }


  const handleOwnerLastNameChange = async (value: string) => {
    setOwnerLastName(value);

    if(value !== ""){
      setOwnerNameMissing(false);
    }

    if(value.length >= 3){
      const data = await searchOwner(value)
      setOwnerSearchResultList(data)
    }
  }

  const handleOwnerFirstNameChange = (value: string) => {
    setOwnerFirstName(value);
  }

  const handleOwnerPhoneChange = (value: string) => {
    setOwnerPhone(value);
  }
  
  const handleOwnerEmailChange = (value: string) => {
    setOwnerEmail(value);
  }

  const handleOwnerStreetChange = (value: string) => {
    setOwnerStreet(value);
  }

  const handleOwnerStreetNoChange = (value: string) => {
    setOwnerStreetNo(value);
  }

  const handleOwnerZipChange = (value: string) => {
    setOwnerZip(value);
  }

  const handleOwnerUpdateFromResultList = (
    owner_id: string,
    last_name: string,
    first_name: string,
    phone: string,
    email: string,
    street: string,
    street_no: string,
    zip: string,
  ) => {
    if(last_name === null) last_name = ""
    if(first_name === null) first_name = ""
    if(phone === null) phone = ""
    if(email === null) email = ""
    if(street === null) street = ""
    if(street_no === null) street_no = ""
    if(zip === null) zip = ""
    setOwnerID(owner_id)
    setOwnerLastName(last_name)
    setOwnerFirstName(first_name)
    setOwnerPhone(phone)
    setOwnerEmail(email)
    setOwnerStreet(street)
    setOwnerStreetNo(street_no)
    setOwnerZip(zip)
    setOwnerSearchResultList([])
  }


  const contacts = ownerSearchResultList.map((row, index) => {
    return (
      <div className='flex flex-row items-center space-x-2 w-full mb-2 border-b-2' key={index}>
        <div className='p-2 w-full'>
        {row["last_name"]}, {row["first_name"]} | {row["street"]} {row["street_no"]} 
        </div>
        <button
        type="button"
        className="bg-button-active rounded-lg items-center justify-center flex text-white p-2"
        onClick={() => {
          handleOwnerUpdateFromResultList(
            row["id"],
            row["last_name"],
            row["first_name"],
            row["phone"],
            row["email"],
            row["street"],
            row["street_no"],
            row["zip"]
        )}}
        >
          übernehmen
        </button>
      </div>
    )
  })
 

  return(
    <div className="border-2 border-white rounded-lg mt-4 flex-col w-full">
      <form className="flex-col w-full">
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="owner-last-name" className="block mb-2 text-black font-thin">Nachname</label>
          <input 
            type="text"
            id="owner-last-name"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={ownerLastName}
            onChange={(event) => {
              handleOwnerLastNameChange(event.target.value);
            }}
            />
          {ownerNameMissing ? (
          <p className="mt-2 font-bold text-red-600 dark:text-red-500">Bitte Nachname angeben!</p>
          ) : ""}
        </div>
        <div className="p-3 w-full">
            <div className='font-thin'>
              {contacts.length > 0 ? "Vorhandenen Kontakt übernehmen?" : ""}
            </div>  
            {contacts}
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="owner-first-name" className="block mb-2 text-black font-thin">Vorname</label>
          <input
            type="text"
            id="owner-first-name"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={ownerFirstName}
            onChange={(event) => {
              handleOwnerFirstNameChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="owner-phone" className="block mb-2 text-black font-thin">Telefon</label>
          <input
            type="text"
            id="owner-phone"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={ownerPhone}
            onChange={(event) => {
              handleOwnerPhoneChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="owner-email" className="block mb-2 text-black font-thin">Email</label>
          <input
            type="text"
            id="owner-email"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={ownerEmail}
            onChange={(event) => {
              handleOwnerEmailChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="owner-street" className="block mb-2 text-black font-thin">Straße</label>
          <input
            type="text"
            id="owner-street"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={ownerStreet}
            onChange={(event) => {
              handleOwnerStreetChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="owner-street-no" className="block mb-2 text-black font-thin">Hausnr.</label>
          <input
            type="text"
            id="owner-street-no"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={ownerStreetNo}
            onChange={(event) => {
              handleOwnerStreetNoChange(event.target.value);
            }}
            />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <label htmlFor="owner-zip" className="block mb-2 text-black font-thin">PLZ</label>
          <input
            type="text"
            id="owner-zip"
            className="bg-white border rounded-lg block w-full p-2.5"
            value={ownerZip}
            onChange={(event) => {
              handleOwnerZipChange(event.target.value);
            }}
            />
        </div>
      </form>
      <div className="w-full p-3 flex flex-row space-x-2">
        {ownerID ? (
          <button 
          className="bg-button-active text-info rounded-lg p-3 w-full"
          onClick={handleRemoveOwnerLinkButtonClick}
          >
            Zuordnung entfernen
          </button>
        ) : ""
        }
        <button 
        className="bg-button-active text-white rounded-lg p-3 w-full"
        onClick={handleSaveButtonClick}
        >
          {ownerID ? "Änderungen speichern" : "Kontakt neu anlegen"}
        </button>
      </div>
    </div>
  )
}