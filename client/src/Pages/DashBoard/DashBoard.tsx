import React, { MouseEventHandler, useContext, useEffect, useState } from 'react'
import SideBar from './SideBar'
import GraphView from './GraphView'
import OverlayDialog from '../../Components/CreateDevice/OverlayDialog';
import { UserContext } from '../../App';

const NO_VALUE = "no_value"

function DashBoard() {
    let [sensorId, setSensorId] = useState(NO_VALUE);
    let [deviceId, setDeviceId] = useState(NO_VALUE);
    let [deviceName, setDeviceName] = useState("");
    let [showDialog, setShowDialog] = useState(false);
    let { userUID, setUserUID } = useContext(UserContext);
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



    const openDialog: Function = () => {
        setShowDialog(!showDialog)
    }
    const closeDialog: Function = () => {
        setTimeout(() => {
            setShowDialog(false);
        }, 800);
    }
    return (
        <div className="flex flex-row bg-gray-900 justify-center pt-10">
            <OverlayDialog isOpen={showDialog} closeDialog={closeDialog}>
                <GraphView sensorId={sensorId}
                    deviceName={deviceName} deviceId={deviceId}
                    loadSensorChart={loadSensorChart}
                />
                <SideBar loadSensorDevices={loadSensorDevices} openCreateDevice={openDialog} />
            </OverlayDialog>
        </div>
    )
}

export default DashBoard