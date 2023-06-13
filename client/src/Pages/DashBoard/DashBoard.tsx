import React, { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import SideBar from './SideBar'
import CenterView from './CenterView'
import OverlayDialog from '../../Components/CreateDevice/OverlayDialog';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { emptyValues } from '../../../../utils'
import { CenterViewContextType } from './DashBoardTypes';


function DashBoard() {
    let [centerViewContext, setCenterViewContextType] = useState<CenterViewContextType>({
        sensorId: emptyValues.STRING,
        deviceId: emptyValues.STRING,
        deviceName: emptyValues.STRING,
        reRender: false
    });
    let [dialogType, setDialogType] = useState(0);
    let { userUID } = useContext(UserContext);
    let [refresCallbacks, setRefreshCallBacks] = useState<Set<Function>>(new Set<Function>());
    const navigate = useNavigate()

    const setEdgeDevice = (event: React.MouseEvent) => {
        //event.stopPropagation();
        const clickEventTarget = event ? event.target : null;
        const clickedElement = clickEventTarget as HTMLButtonElement
        let newDeviceData = clickedElement.id.split(":");
        console.log("dashboard reRender : ",centerViewContext.reRender)
        let reRender = !centerViewContext.reRender;
        console.log("dashboard reRender : ",reRender)
        setCenterViewContextType({
            deviceId: newDeviceData[0],
            deviceName: newDeviceData[1],
            sensorId: emptyValues.STRING,
            reRender: reRender
        });
        

    }

    const setSensorDevice = (event: React.MouseEvent) => {
        const clickEventTarget = event ? event.target : null;
        const clickedElement = clickEventTarget as HTMLButtonElement
        let newSensorId = clickedElement.id as string;
        setCenterViewContextType({ ...centerViewContext, sensorId: newSensorId });
    }

    useEffect(() => {
        if (userUID === "")
            navigate("/auth");
    }, [])




    const openDialog: Function = (dialogType: number) => {
        setDialogType(dialogType)
    }
    
    const closeDialog: Function = () => {
        setTimeout(() => {
            setDialogType(0);
        }, 800);
    }
    
    const refresh: Function = () => {
        for (let callBack of refresCallbacks) {
            
            callBack();
        }
    }
    return (
        <div className="flex flex-row bg-gray-900 justify-center pt-10 max-[900px]:px-[20px] max-[900px]:flex-col">
            <OverlayDialog dialogType={dialogType} closeDialog={closeDialog} refresh={refresh}>
                <CenterView
                    centerViewContext={centerViewContext}
                    loadSensorChart={setSensorDevice}
                    setRefreshCallbacks={setRefreshCallBacks}
                    openDialog={openDialog}
                />
                <SideBar loadSensorDevices={setEdgeDevice} openCreateDevice={openDialog} setRefreshCallbacks={setRefreshCallBacks} />
            </OverlayDialog>
        </div>
    )
}

export default DashBoard