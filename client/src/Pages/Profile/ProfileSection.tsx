import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import Loader from '../../Components/Loader/Loader';


interface ProfileSectionPropType {
    name: string,
    emailId: string,
    devices: any,
    isLoading: boolean
}

interface Counters {
    numEdgeDevices: number,
    numSensorDevices: number,
}

function ProfileSection(props: ProfileSectionPropType) {

    let [counters, setCounters] = useState<Counters>({
        numEdgeDevices: 0,
        numSensorDevices: 0
    });
    let { setUserUID } = useContext(UserContext);

    const clickHandler = () => {
        setUserUID("");
        window.location.pathname = "/";
    }

    //use Effect for Devices
    useEffect(() => {
        counters.numEdgeDevices = props.devices.length
        let numSensorDevices = 0;
        for (let device of props.devices) {
            numSensorDevices += device.sensors.length;
        }
        counters.numSensorDevices = numSensorDevices;
        setCounters(counters);
    }, [props.devices])

    return (
        <>
            {

                <div className="flex flex-col w-3/12 bg-gray-700 items-center pt-10">
                    {props.isLoading ? <div className="justify-self-center"><Loader show={props.isLoading} /></div> :
                        <>
                            <div className="m-4">
                                <img
                                    className="w-24 h-24"
                                    src="../../user.png"
                                    alt="Profile picture"
                                />
                            </div>
                            <div className="p-2 flex flex-col bg-gray-800 rounded-lg shadow-lg items-center w-11/12">
                                <div className="p-4 flex flex-row items-center w-11/12">
                                    <p className="text-white text-center font-bold text-lg w-5/12">Name : </p>
                                    <div className="mx-3 flex-grow w-7/12 font-bold bg-gray-700 text-white shadow-lg rounded-lg hover:border-2 hover:scale-[1.05] hover:border-schn-500 transition-all duration-1000 p-3">  {props.name}</div>
                                </div>
                                <div className="p-4 flex flex-row items-center w-11/12">
                                    <p className="text-white text-center font-bold text-lg w-5/12">Email Address : </p>
                                    <div className="mx-3 w-7/12 font-bold bg-gray-700 text-white shadow-lg rounded-lg hover:border-2 hover:scale-[1.05] hover:border-schn-500 transition-all duration-1000 p-3">  {props.emailId}</div>
                                </div>
                                <div className="p-4 flex flex-row items-center w-11/12">
                                    <p className="text-white text-center font-bold text-lg w-5/12">Total edge devices : </p>
                                    <div className="mx-3 w-7/12 font-bold bg-gray-700 text-white shadow-lg rounded-lg hover:border-2 hover:scale-[1.05] hover:border-schn-500 transition-all duration-1000 p-3 text-center">  {counters.numEdgeDevices}</div>
                                </div>
                                <div className="p-4 flex flex-row items-center w-11/12">
                                    <p className="text-white text-center font-bold text-lg w-5/12">Total edge devices : </p>
                                    <div className="mx-3 w-7/12 font-bold bg-gray-700 text-white shadow-lg rounded-lg hover:border-2 hover:scale-[1.05] hover:border-schn-500 transition-all duration-1000 p-3 text-center">  {counters.numSensorDevices}</div>
                                </div>
                            </div>

                            <button onClick={clickHandler} className="my-5 px-5 py-2 bg-red-400 hover:bg-red-700 text-white font-bold rounded-md shadow-lg text-center">Sign out</button>
                        </>
                    }
                </div>

            }
        </>
    )
}

export default ProfileSection