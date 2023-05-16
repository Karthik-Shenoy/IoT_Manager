import React, { useEffect, useRef, useState } from 'react'
import ManageCard from './ManageCard'
import Loader from '../../Components/Loader/Loader';

interface ManageSensorsPropTypes {
    sensors: any[] | null,
    isLoading: boolean
    reloadPage: Function;
}

function ManageSensors(props: ManageSensorsPropTypes) {
    const divRef = useRef<HTMLDivElement>(null);
    //for animations

    const deleteHandler = (event: React.MouseEvent) => {
        let sensorCardButton = event.target as HTMLButtonElement;
        let sensorIdData = sensorCardButton.id;
        let [sensorId, deviceId] = sensorIdData.split(":");

        const deleteSensor = async () => {
            let response = await fetch(`/data/sensors/${deviceId}`, {
                method: "DELETE",
                body: JSON.stringify({
                    'sensorId': sensorId
                }),
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            response = await response.json();
            console.log(typeof(props.reloadPage()));
            console.log(response)
        }

        deleteSensor();

    }

    useEffect(() => {
        let divElement = divRef.current as HTMLDivElement
        if (!divElement)
            return;
        divElement.style.animationName = "animateDivGrow";
        divElement.style.animationTimingFunction = "ease-in-out";
        divElement.style.animationDuration = "1s";
        setTimeout(() => {
            divElement.style.animationName = "";
        }, 1000)
        return (() => {

        })
    }, [props.sensors])
    return (
        <>
            <div className="flex flex-col w-full bg-gray-900 items-center">
                <div className="flex flex-col min-h-[260px] font-mono self-center rounded-lg shadow-lg bg-gray-700 w-11/12 min-w-0 my-4 p-3 justify-center">
                    <div className="p-4 self-center">
                        <p className="text-white font-bold text-lg px-5 w-full py-2 shadow-lg bg-gray-800 rounded-lg">Manage Sensors</p>
                    </div>
                    {props.isLoading ? <div className="justify-self-center"><Loader show={props.isLoading} /></div> :
                        <div ref={divRef} className="cta-sensor-div flex flex-row space-x-3 overflow-x-auto self-center items-center bg-gray-700 w-full h-full p-1">
                            {
                                props.sensors && (
                                    props.sensors.length === 0 ? <ManageCard clickHandler={() => { }} deleteHandler={() => { }} payload={null} type={3} /> :
                                        props.sensors.map((value, index) => {
                                            return (
                                                <ManageCard clickHandler={() => { }} deleteHandler={deleteHandler} payload={value} type={2} />
                                            )
                                        })
                                )
                            }
                            {
                                !(props.sensors) && <div className="max-h-[70px] bg-gray-800 rounded-lg shadow-lg p-5">
                                    <p className="text-xl text-red-400"> Chooses an edge device</p>
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

export default ManageSensors