import React, { useEffect, useRef } from 'react'

function Devices() {
    let nodeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        let buttonElement = nodeRef.current;
        if (!buttonElement)
            return;
        const fetchResource = async () => {

            const response = await fetch("/data", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    userId: 1,
                    key: "xcAZ=_alpO",
                }),
            });

            const responseVal = await response.text();
            console.log(response)
            console.log(responseVal);
        };
        const clickHandler = () => {
            fetchResource();
        }


        buttonElement.addEventListener("click", clickHandler)

        return () => {
            if (!buttonElement)
                return;
            buttonElement.removeEventListener("click", clickHandler);
        }
    }, []);
    return (
        <>
            <div className="flex place-items-center font-mono justify-center h-screen bg-gray-900">
                <button ref={nodeRef} className="p-3 max-h-[50px] font-bold text-white rounded-lg bg-gray-600 hover:bg-gray-700  hover:text-schn-500 transition duration-300">create device</button>
            </div>
        </>
    )
}

export default Devices