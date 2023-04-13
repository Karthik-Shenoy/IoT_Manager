import React, { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import SideBar from './SideBar'
import GraphView from './GraphView'
import OverlayDialog from '../../Components/CreateDevice/OverlayDialog';
import { UserContext } from '../../App';

const NO_VALUE = "no_value"

function DashBoard() {
    let [sensorId, setSensorId] = useState(NO_VALUE);
    let [deviceId, setDeviceId] = useState(NO_VALUE);
    let [deviceName, setDeviceName] = useState("");
    let [dialogType, setDialogType] = useState(0);
    let { userUID, setUserUID } = useContext(UserContext);
    let [refresCallbacks, setRefreshCallBacks] = useState<Set<Function>>(new Set<Function>());


    const loadSensorDevices = (event: React.MouseEvent) => {
        //event.stopPropagation();
        const clickEventTarget = event ? event.target : null;
        const clickedElement = clickEventTarget as HTMLButtonElement
        let newDeviceId = clickedElement.id.split(":");
        setDeviceId(newDeviceId[0]);
        setDeviceName(newDeviceId[1]);
        setSensorId(NO_VALUE);
    }
    const loadSensorChart = (event: React.MouseEvent) => {
        const clickEventTarget = event ? event.target : null;
        const clickedElement = clickEventTarget as HTMLButtonElement
        let newSensorId = clickedElement.id;
        setSensorId(newSensorId);
    }
    console.log(userUID)
    if (userUID === "")
        window.location.pathname = "/auth";



    const openDialog: Function = (dialogType: number) => {
        setDialogType(dialogType)
    }
    const closeDialog: Function = () => {
        setTimeout(() => {
            setDialogType(0);
        }, 800);
    }
    const refresh: Function = () => {
        for(let callBack of refresCallbacks){
            console.log(callBack)
            callBack();
        }
    }
    return (
        <div className="flex flex-row bg-gray-900 justify-center pt-10">
            <OverlayDialog dialogType={dialogType} closeDialog={closeDialog} refresh={refresh}>
                <GraphView sensorId={sensorId}
                    deviceName={deviceName} 
                    deviceId={deviceId}
                    loadSensorChart={loadSensorChart}
                    setRefreshCallbacks={setRefreshCallBacks}
                    openDialog={openDialog}
                />
                <SideBar loadSensorDevices={loadSensorDevices} openCreateDevice={openDialog} setRefreshCallbacks={setRefreshCallBacks} />
            </OverlayDialog>
        </div>
    )
}

export default DashBoard