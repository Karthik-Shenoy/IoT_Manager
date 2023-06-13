import React, { useContext, useEffect, useState } from 'react'
import ManageDevices from './ManageDevices'
import ManageSensors from './ManageSensors'
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { EdgeDevice } from './ProfilePageUtils';

interface ManageSectionPropType{
    devices: EdgeDevice[];
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

    const reloadPage= () => {
        props.reloadPage();
        setSelectedSensors(null);
    }

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
            <div className="flex flex-col w-9/12 bg-gray-900 pt-10 items-center max-[900px]: w-full">
                <ManageDevices isLoading={props.isLoading} devices={props.devices} clickHandler={clickHandler} reloadPage= {reloadPage}/>

                {/* Sensor Device details */}
                <ManageSensors isLoading={props.isLoading} sensors={selsectedSensors} reloadPage={reloadPage}/>
            </div>
        </>
    )
}

export default ManageSection