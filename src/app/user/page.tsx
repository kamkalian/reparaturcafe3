'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useState } from 'react' 
import { FormEvent } from 'react'


async function getData() {
    const apiBaseURL = process.env.NEXT_PUBLIC_API_URL
    //const token = localStorage.getItem("token");
    const res = await fetch(`${apiBaseURL}/api/user/me`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + "token"
      },
    })
    if (res.ok) {
      const json = await res.json()
      console.log(json)
      return json
    } else {
      //alert("Username or password wrong!")
    }
  }





export default async function Page() {
    const data = await getData();
  return (
    <>
        test
    </>
  )
}


