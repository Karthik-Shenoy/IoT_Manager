import React, { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import SideBarCard from './SideBarCard'
import readings from './pdata'
import { UserContext } from '../../App'
import Loader from '../../Components/Loader/Loader'

interface SideBarPropType {
  loadSensorDevices: MouseEventHandler<HTMLDivElement>
  openCreateDevice: Function,
  setRefreshCallbacks: React.Dispatch<React.SetStateAction<Set<Function>>>
}

function SideBar(props: SideBarPropType) {
  // fetch device data and render components
  let nodeRef = useRef<HTMLButtonElement>(null);
  let [renderLst, setRenderLst] = useState([]);
  let { userUID, setUserUID } = useContext(UserContext)
  let [isLoading, setIsLoading] = useState(false);
  let [reRender, setReRender] = useState(true);


  useEffect(() => {
    let buttonElement = nodeRef.current;

    if (!buttonElement)
      return;
    const clickHandler = () => {
      props.openCreateDevice(1);
    }

    props.setRefreshCallbacks((prevState: Set<Function>) => {
      prevState.add(() => {
        setReRender(!reRender)
      })
      return prevState;
    })


    buttonElement.addEventListener("click", clickHandler)

    return () => {
      if (!buttonElement)
        return;
      buttonElement.removeEventListener("click", clickHandler);
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const response = await fetch(`/data/createResource/${userUID}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      const responseVal = await response.json();
      const deviceLst = responseVal.devices;
      setRenderLst(deviceLst.map((device: any, index: any) => {
        return (<SideBarCard clickHandler={props.loadSensorDevices} payload={device} key={device._id} type={1} />);
      }))
      setIsLoading(false);
    }
    getData()
  }, [reRender])
  return (
    <div className="flex flex-col bg-gray-700 rounded-lg font-mono items-center ml-auto mr-4 w-3/12 h-screen py-4 px-3 max-[800px]:hidden">
      <div className="bg-gray-800 text-lg rounded-lg p-3 w-11/12 text-white font-bold text-center mb-3">Edge Devices</div>
      {isLoading ? <Loader show={isLoading} /> : renderLst}
      <button ref={nodeRef} className="p-3 mt-4 font-bold text-white rounded-lg bg-gray-800 hover:scale-[1.1]  hover:text-schn-500 transition-all duration-300">create device</button>
    </div>
  )
}

export default SideBar