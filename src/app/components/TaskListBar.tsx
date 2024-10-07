"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AddButton from "./AddButton";
import React from "react";
import DeviceForm from "./DeviceForm";


export default function TaskListBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || "");
  const [stateNewFilter, setStateNewFilter] = useState(Boolean);
  const [stateInProcessFilter, setStateInProcessFilter] = useState(Boolean);
  const [stateDoneFilter, setStateDoneFilter] = useState(Boolean);
  const [stateCompletedFilter, setStateCompletedFilter] = useState(Boolean);
  const [addFormOpen, setAddFormOpen] = useState(false);

  useEffect(() => {
    if(searchTerm !== undefined && searchTerm !==""){
      setSearchActive(true)
    }
    setStateNewFilter(searchParams.get('new')?.toString() === "1" ? true : false);
    setStateInProcessFilter(searchParams.get('in_process')?.toString() === "1" ? true : false);
    setStateDoneFilter(searchParams.get('done')?.toString() === "1" ? true : false);
    setStateCompletedFilter(searchParams.get('completed')?.toString() === "1" ? true : false);
  }, [])

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if(term) {
      params.set('query', term);
      setSearchTerm(term);
      setSearchActive(true);
    } else {
      params.delete('query');
      setSearchTerm("");
      setSearchActive(false);
    }
    replace(`${pathname}?${params.toString()}`); 
  }

  function handleClearSearch() {
    handleSearch("");
  }

  function handleStateFilterChange(filterName: string, filterChecked: boolean){
    const params = new URLSearchParams(searchParams);

    switch(filterName){
      case "new": {
        setStateNewFilter(filterChecked);
        if(filterChecked === true){
          params.set("new", "1");
        }else{
          params.delete("new");
        }
        break;
      }
      case "in_process": {
        setStateInProcessFilter(filterChecked);
        if(filterChecked === true){
          params.set("in_process", "1");
        }else{
          params.delete("in_process");
        }
        break;
      }
      case "done": {
        setStateDoneFilter(filterChecked);
        if(filterChecked === true){
          params.set("done", "1");
        }else{
          params.delete("done");
        }
        break;
      }
      case "completed": {
        setStateCompletedFilter(filterChecked);
        if(filterChecked === true){
          params.set("completed", "1");
        }else{
          params.delete("completed");
        }
        break;
      }
    }
    replace(`${pathname}?${params.toString()}`); 
  }

  const handleAddButtonClick = () => {
      setAddFormOpen(!addFormOpen);
  }

  return(
    <div className="bg-gray-300 p-4 rounded-md">
      <div className="flex">
        <div className="relative w-1/3 flex">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          </div>
          <input 
            type="text" 
            id="table-search" 
            className="block p-2 ps-10 text-gray-900 w-full rounded-lg bg-gray-50" 
            placeholder="Suchen" 
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            value={searchTerm}
            />
          {searchActive ? (
          <button className="absolute right-0 inset-y-0 bg-gray-50 px-2 rounded-lg items-center" onClick={handleClearSearch}>
            <svg className="h-8 w-8 text-red-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          ) : ""}
        </div>
        <ul className="w-1/2 items-center text-black border-white border-2 rounded-lg sm:flex mx-4">
          <li className="w-full">
              <div className="flex items-center ps-3">
                  <input 
                    id="vue-checkbox-list"
                    type="checkbox"
                    checked={stateNewFilter}
                    className="size-6"
                    onChange={(e) => {
                      handleStateFilterChange("new", e.target.checked)}}
                  />
                  <label htmlFor="vue-checkbox-list" className="w-full py-1 ms-2 text-gray-900">Neu</label>
              </div>
          </li>
          <li className="w-full">
              <div className="flex items-center ps-3">
                  <input
                    id="react-checkbox-list"
                    type="checkbox"
                    checked={stateInProcessFilter}
                    className="size-6"
                    onChange={(e) => {
                      handleStateFilterChange("in_process", e.target.checked)}}
                  />
                  <label htmlFor="react-checkbox-list" className="w-full py-1 ms-2 text-gray-900">In Arbeit</label>
              </div>
          </li>
          <li className="w-full">
              <div className="flex items-center ps-3">
                  <input
                    id="angular-checkbox-list"
                    type="checkbox"
                    checked={stateDoneFilter}
                    className="size-6"
                    onChange={(e) => {
                      handleStateFilterChange("done", e.target.checked)}}
                  />
                  <label htmlFor="angular-checkbox-list" className="w-full py-1 ms-2 text-gray-900">Fertig</label>
              </div>
          </li>
          <li className="w-full">
              <div className="flex items-center px-3">
                  <input
                    id="laravel-checkbox-list"
                    type="checkbox"
                    checked={stateCompletedFilter} 
                    className="size-6"
                    onChange={(e) => {
                      handleStateFilterChange("completed", e.target.checked)}}
                  />
                  <label htmlFor="laravel-checkbox-list" className="w-full py-1 ms-2 text-gray-900">Abgeschlossen</label>
              </div>
          </li>
      </ul>
      <div className="flex-auto"></div>
      <AddButton
        handleAddButtonClick={handleAddButtonClick}
      />
      </div>
      {addFormOpen ? (
        <>
          <div className="pt-10 font-bold">
            Neues Gerät aufnehmen
          </div>
          <DeviceForm
          new_or_edit="new"
          />
        </>
      ) : ""}
    </div>
  );
}