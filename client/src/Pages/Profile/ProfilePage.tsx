import React, { createContext, useContext, useEffect, useState } from "react";
import ProfileSection from "./ProfileSection";
import ManageSection from "./ManageSection";
import { UserContext } from "../../App";
import { EdgeCardPayload, EdgeDevice, SensorDevice } from "./ProfilePageUtils";

interface UserData {
    name: string,
    emailId: string,
    found: boolean,
}

interface ProfileContextType {
    reRender: boolean,
    setReRender: (reRender: boolean) => void
}

export const ProfileContext = createContext<ProfileContextType>({
    reRender: false,
    setReRender: () => { }
})

const ProfilePage = () => {
    let { userUID } = useContext((UserContext));
    let [currentUser, setCurrentUser] = useState<UserData>({
        name: "",
        emailId: "",
        found: false
    })
    let [isLoading, setIsLoading] = useState<boolean>(false);
    let [devices, setDevices] = useState<any[]>([]);
    let [reRender, setReRender] = useState<boolean>(false);

    const reloadPage = () => {
        setReRender(!reRender);
    }

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            let response = await fetch(`/data/signin/${userUID}`);
            const currentUserData: UserData = await response.json();
            console.log("User Data : ", currentUserData);
            response = await fetch(`/data/edgeDevices/${userUID}`);
            const deviceData = await response.json();

            //console.log(deviceData)
            if (currentUserData.found) {
                setCurrentUser(currentUserData);
            }
            if (deviceData) {
                let deviceList: EdgeDevice[] = deviceData.devices;
                for (let device of deviceList) {
                    let sensorsPromiseResponse = await fetch(`/data/sensors/${device.deviceId}`);
                    let sensors = await sensorsPromiseResponse.json()
                    let sensorMap: Map<string, SensorDevice> = new Map<string, SensorDevice>();
                    let provisonedSensors = new Set<string>(sensors.provisonedSensors.map((value: SensorDevice) => {
                        return value.sensorId;
                    }))
                    for (let reading of sensors.devices) {
                        sensorMap.set(reading.sensorId, reading);
                    }
                    let sensorList:SensorDevice[] = [];
                    for (let [key, value] of sensorMap) {
                        if (provisonedSensors.has(key))
                            sensorList.push(value);
                    }
                    console.log(sensorList)
                    device.sensors = sensorList;
                }
                setDevices(deviceData.devices);
            }
            setIsLoading(false);
        }
        getData();
    }, [userUID, reRender])
    return (
        <div className="flex flex-row bg-gray-900 justify-center h-full min-h-screen max-[900px]:p-[20px] max-[900px]:flex-col">
            {/* Sidebar */}
            <ProfileContext.Provider value={{reRender, setReRender}}>
                
                <ProfileSection isLoading={isLoading} name={currentUser.name} emailId={currentUser.emailId} devices={devices} />

                {/* Manage Edge Devices */}
                <ManageSection isLoading={isLoading} devices={devices} reloadPage={reloadPage}/>
            </ProfileContext.Provider>

        </div>
    );
};

export default ProfilePage;
