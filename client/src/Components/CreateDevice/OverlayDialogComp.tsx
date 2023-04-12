import React, {useRef } from 'react';
import { UserContext } from '../../App';

interface DialogPropType {
  isOpen: boolean,
  closeDialog: Function
  children: any
}

function ProvisonDeviceDialog(props: DialogPropType) {

  const dialogRef = useRef<HTMLDivElement>(null);

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
              <div className="flex flex-row">
                <div className="px-8 py-6">
                  <h2 className="text-white border-2 border-schn-500 p-1 rounded-lg font-bold text-2xl text-center mb-6">Provison<b className="text-schn-500">Device</b></h2>
                  <div>
                    <p className="block text-white  font-bold my-2">
                      Device Sucessfully Provisoned
                    </p>
                    <button type="reset" onClick={closeHandler} className="mt-4 ml-2 p-2 w-1/3 bg-gray-800 hover:text-red-500 hover:scale-[1.05] rounded-lg shadow-lg text-white font-bold transition-all duration-1000">
                      close
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      )}
      {props.children}
    </>
  );
}

export default ProvisonDeviceDialog;
