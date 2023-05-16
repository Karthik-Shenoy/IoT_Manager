import React, { useContext, useEffect, useState } from 'react'
import ManageDevices from './ManageDevices'
import ManageSensors from './ManageSensors'
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';

interface ManageSectionPropType{
    devices: any[];
    isLoading: boolean;
    reloadPage: Function;
}

function ManageSection(props: ManageSectionPropType) {
    const [selsectedSensors, setSelectedSensors] = useState<any[] | null>(null);
    let {userUID} = useContext(UserContext);
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(userUID === "")
            navigate("/auth");
    }, [])

    console.log("manage section reload function:", typeof(props.reloadPage))
    const clickHandler = (event: React.MouseEvent) => {
        let buttonElement = event.target as HTMLButtonElement;
        let deviceId = buttonElement.id;
        deviceId = deviceId.split(":")[0];
        for (let device of props.devices) {
            if (device.deviceId === deviceId)
                setSelectedSensors(device.sensors)
        }
    }

    return (
        <>
            <div className="flex flex-col w-9/12 bg-gray-900 pt-10 items-center">
                <ManageDevices isLoading={props.isLoading} devices={props.devices} clickHandler={clickHandler} />

                {/* Sensor Device details */}
                <ManageSensors isLoading={props.isLoading} sensors={selsectedSensors} reloadPage={props.reloadPage}/>
            </div>
        </>
    )
}

export default ManageSection