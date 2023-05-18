import React, { HtmlHTMLAttributes, MouseEventHandler, useContext, useState } from 'react'
import ManageCard from './ManageCard'
import Loader from '../../Components/Loader/Loader'
import { EdgeCardPayload, EdgeDevice, getHumanReadableDate } from './ProfilePageUtils';
import { UserContext } from '../../App';

interface ManageDevicesPropTypes {
    devices: any[],
    clickHandler: React.MouseEventHandler,
    isLoading: boolean,
    reloadPage: Function
}

function ManageDevices(props: ManageDevicesPropTypes) {
    const [isLoading, setIsLoading] = useState<boolean>(props.isLoading);
    let { userUID } = useContext((UserContext));

    const deleteHandler = async (event: React.MouseEvent) => {
        let element = event.target as HTMLButtonElement;
        let [deviceId, deviceName] = element.id.split(":");
        setIsLoading(true);
        let deletePromise = await fetch(`/data/edgeDevices/${userUID}`, {
            method: "DELETE",
            body: JSON.stringify({
                deviceId: deviceId
            }),
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        let response = await deletePromise.json();
        console.log("deleted : ", response);
        setIsLoading(false);
        props.reloadPage();

    
    }

    const getEdgeCardPayload = (device: EdgeDevice): EdgeCardPayload => {
        let edgeCardPayload: EdgeCardPayload = {
            deviceId: "",
            deviceName: "",
            numSensors: 0,
            lastUpdated: ""
        };
        edgeCardPayload.deviceId = device.deviceId;
        edgeCardPayload.deviceName = device.deviceName;
        edgeCardPayload.numSensors = device.sensors.length;
        let lastReading = device.sensors.at(-1);
        if (lastReading)
            edgeCardPayload.lastUpdated = getHumanReadableDate(lastReading.date) + " " + lastReading.time.slice(0, 6);
        return edgeCardPayload;
    }

    return (
        <>
            <div className="flex flex-col w-full bg-gray-900 pt-10 items-center">

                <div className="flex flex-col min-h-[260px] font-mono self-center rounded-lg shadow-lg bg-gray-700 w-11/12 min-w-0 my-4 p-3 justify-center">
                    <div className="p-4 self-center">
                        <p className="text-white font-bold text-lg px-5 w-full py-2 shadow-lg bg-gray-800 rounded-lg">Manage Edge devices</p>
                    </div>
                    {props.isLoading || isLoading ? <div className="justify-self-center"><Loader show={props.isLoading || isLoading} /></div> :
                        <div className="cta-sensor-div flex flex-row space-x-3 overflow-x-auto self-center bg-gray-700 w-full h-full items-center p-1">
                            {
                                props.devices.map((value, index) => {
                                    let edgeCardPayload = getEdgeCardPayload(value);
                                    return (
                                        <ManageCard clickHandler={props.clickHandler} deleteHandler={deleteHandler} payload={edgeCardPayload} type={1} />
                                    )
                                })
                            }
                            {
                                (props.devices.length == 0) && <div className="max-h-[70px] max-w-[250px] bg-gray-800 rounded-lg shadow-lg p-5">
                                    <p className="text-xl text-red-400"> No Edge Devices </p>
                                </div>
                            }
                        </div>
                    }
                </div>

                <div className="flex flex-wrap p-4">

                </div>
            </div>
        </>
    )
}

export default ManageDevices
