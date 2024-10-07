'use client'


export default function AddButton(props: {handleAddButtonClick}) {

    return(
        <button 
        className="bg-button-active rounded-lg w-14 h-14 items-center justify-center flex"
        onClick={props.handleAddButtonClick}
        >
        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
        </svg>
        </button>
    )

}