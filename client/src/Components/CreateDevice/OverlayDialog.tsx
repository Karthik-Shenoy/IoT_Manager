import React, { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../App';
import CreateDeviceForm from './CreateDeviceForm';
import Loader from '../Loader/Loader';
import ProvisonPrompt from './ProvisonPrompt';

interface DialogPropType {
  dialogType: number,
  closeDialog: Function
  children: any,
  refresh: Function,
}

enum DialogTypes {
  CREATE_DEVICE = 1,
  PROVISION_SENSOR = 2
}

function OverlayDialog(props: DialogPropType) {

  let { userUID, setUserUID } = useContext(UserContext);
  let [isLoading, setIsLoading] = useState(false);
  let [dialogElement, setDialogElement] = useState<JSX.Element>(<></>)
  const dialogRef = useRef<HTMLDivElement>(null);

  const submitHandler: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const deviceConnectionKeyInput = form.querySelector("#deviceConnectionKey") as HTMLInputElement;
    const deviceNameInput = form.querySelector("#deviceName") as HTMLInputElement;
    console.log(userUID, deviceConnectionKeyInput.value);
    const fetchResource = async () => {
      setIsLoading(true);
      const response = await fetch("/data/edgeDevices/create", {
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
    };
    fetchResource().then(() => {
      console.log("loading...ended");
      props.closeDialog();
      setTimeout(() => {
        setIsLoading(false);
        props.refresh();
      }, 1000);

    });
  }
  const closeHandler: React.MouseEventHandler = () => {
    const dialogDiv = dialogRef.current as HTMLDivElement;
    dialogDiv.style.scale = "0";
    props.closeDialog()
    props.refresh()
  }
  useEffect(() => {
    if (props.dialogType === DialogTypes.CREATE_DEVICE)
      setDialogElement(<CreateDeviceForm submitHandler={submitHandler} closeHandler={closeHandler} />)
    if (props.dialogType === DialogTypes.PROVISION_SENSOR)
      setDialogElement(<ProvisonPrompt closeHandler={closeHandler} />)
  }, [props.dialogType])




  return (
    <>
      {props.dialogType > 0 && (
        <div className="fixed font-mono inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-900 bg-opacity-75">
          <div ref={dialogRef} className="relative bg-gray-700 w-7/12 h-7/12 max-w-md p-6 mx-auto rounded-md transition-all duration-1000">
            {
              isLoading ? <Loader show={isLoading} /> : dialogElement
            }
          </div>
        </div>
      )}
      {props.children}
    </>
  );
}

export default OverlayDialog;

/*
*/