'use client'


export default function EditButton(props: {handleEditButtonClick}) {

    return(
        <button 
        className="bg-button-active rounded-lg w-14 h-14 items-center justify-center flex print:hidden"
        onClick={props.handleEditButtonClick}
        >
        <svg
            className="text-white h-12 w-12 p-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </button>
    )

}