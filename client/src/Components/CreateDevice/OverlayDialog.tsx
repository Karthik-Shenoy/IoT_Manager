import React, { MouseEventHandler, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../../App';

interface DialogPropType {
  isOpen: boolean,
  closeDialog: Function
  children: any
}

function OverlayDialog(props: DialogPropType) {

  let { userUID, setUserUID } = useContext(UserContext);

  const dialogRef = useRef<HTMLDivElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const deviceConnectionKeyInput = form.querySelector("#deviceConnectionKey") as HTMLInputElement;
    const deviceNameInput = form.querySelector("#deviceName") as HTMLInputElement;
    console.log(userUID, deviceConnectionKeyInput.value);
    const fetchResource = async () => {

      const response = await fetch("/data/createResource", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          UID: userUID,
          deviceName: deviceNameInput.value,
          deviceConnectionKey: deviceConnectionKeyInput.value
        }),
      });

      const responseVal = await response.text();
      console.log(responseVal);
    };
    fetchResource();
    console.log(userUID)
  }



  const closeHandler = () => {
    const dialogDiv = dialogRef.current as HTMLDivElement;
    dialogDiv.style.scale = "0";
    props.closeDialog()
  }

  return (
    <>
      {props.isOpen && (
        <div className="fixed font-mono inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-900 bg-opacity-75">
          <div ref={dialogRef} className="relative bg-gray-700 w-7/12 h-7/12 max-w-md p-6 mx-auto rounded-md transition-all duration-1000">

            <form onSubmit={submitHandler} className="w-full">
              <div className="flex flex-row">
                <div className="px-8 py-6">
                  <h2 className="text-white border-2 border-schn-500 p-1 rounded-lg font-bold text-2xl text-center mb-6">Create<b className="text-schn-500">Device</b></h2>
                  <div>
                    <p className="block text-white  font-bold my-2">
                      Enter the edge device UID to provision your edge device make sure that edge device is connected to the internet
                    </p>
                    <label htmlFor="email" className="block text-lg text-schn-400 font-bold mb-2">
                      Enter Device UID
                    </label>
                    <input
                      type="deviceConnectionKey"
                      id="deviceConnectionKey"
                      className="block w-full bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500"
                      placeholder="Edge Device UID"
                      required
                    />
                    <label htmlFor="email" className="block text-lg text-schn-400 font-bold my-3">
                      Enter Device Name
                    </label>
                    <input
                      type="deviceName"
                      id="deviceName"
                      className="block w-full bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500"
                      placeholder="Device Name"
                      required
                    />
                    <button type="submit" className="mt-4 p-2 w-1/2 bg-gray-800 hover:text-schn-500 hover:scale-[1.05] rounded-lg shadow-lg text-white font-bold transition-all duration-1000">
                      Create Device
                    </button>
                    <button type="reset" onClick={closeHandler} className="mt-4 ml-2 p-2 w-1/3 bg-gray-800 hover:text-red-500 hover:scale-[1.05] rounded-lg shadow-lg text-white font-bold transition-all duration-1000">
                      close
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {props.children}
    </>
  );
}

export default OverlayDialog;
