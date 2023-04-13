import React, { ChangeEvent, MouseEventHandler, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import SideBarCard from '../SideBarCard'
import './SensorInfo.css'
import Loader from '../../../Components/Loader/Loader'
import { UserContext } from '../../../App';

enum FlagValues {
  RE_RENDER = 1,
  IS_LOADING = 2,
}

interface SensorInfoPropType {
  deviceId: string,
  loadSensorChart: React.MouseEventHandler,
  getAndSetData: Function,
  notifyRealTime: Function,
  setRefreshCallbacks: React.Dispatch<React.SetStateAction<Set<Function>>>
  openDialog: Function
}

function SensorInfo(props: SensorInfoPropType) {
  let devices = new Map<string, any[]>();
  let [renderLst, setRenderLst] = useState([<></>]);
  let [isLoading, setIsLoading] = useState(false);
  let [reRender, setReRender] = useState(true);
  let [realTimeFlag, setRealTimeFlag] = useState(false);
  let realTimeFlagRef = useRef(realTimeFlag);
  let reRenderRef = useRef(reRender);
  let { webSocket, setWebSocket, } = useContext(UserContext);
  let [INIT_SOCKET, setInitSocket] = useState<boolean>(true);



  const realTimeSwitchHandler = (event: ChangeEvent) => {
    const newValue = !realTimeFlagRef.current;
    console.log(newValue);
    setRealTimeFlag(newValue);
    realTimeFlagRef.current = newValue;
    props.notifyRealTime(newValue);
  }


  const provisonSensorDevice: MouseEventHandler = (event: React.MouseEvent) => {
    let provisonButton = event.target as HTMLButtonElement;
    const sensorId = provisonButton.id;
    console.log("provisoned")
    const addSensorToProvisonedLst = async () => {
      const response = await fetch(`/data/sensors/${props.deviceId}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          sensorId: sensorId
        }),
      });
    }
    addSensorToProvisonedLst().then(() => {
      const newValue = !reRenderRef.current;
      setReRender(newValue);
      reRenderRef.current = newValue;
      props.openDialog(2);
    });
  }

  useEffect(() => {

    props.setRefreshCallbacks((prevState: Set<Function>) => {
      prevState.add(() => {
        const newValue = !(reRenderRef.current)
        setReRender(newValue);
        reRenderRef.current = newValue;
      })
      return prevState;
    })

    
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (!realTimeFlagRef.current) {
        setIsLoading(true)
      }
      let sensorsPromiseResponse = await fetch(`/data/sensors/${props.deviceId}`);
      let response = await sensorsPromiseResponse.json();
      //console.log("response : ", response);
      let readings = response.devices;

      let provisonedSensors = new Set(response.provisonedSensors.map((value: any) => {
        return value.sensorId;
      }));

      for (let reading of readings) {
        let index = reading.sensorId;
        let oldList = devices.get(index);
        if (!oldList)
          oldList = [reading];
        else
          oldList.push(reading);
        devices.set(index, oldList);
      }

      let tempLst: JSX.Element[] = [];
      for (let [key, value] of devices) {
        let latestValue = value[value.length - 1];
        latestValue.width = 1;
        latestValue.isProvisioned = false;
        let cardClickHandler = provisonSensorDevice;
        if (provisonedSensors.has(key)) {
          latestValue.isProvisioned = true;
          cardClickHandler = props.loadSensorChart;
        }
        tempLst.push(<SideBarCard clickHandler={cardClickHandler} payload={latestValue} key={key} type={2} />);
      }
      setRenderLst(tempLst);
      props.getAndSetData(readings);
      setIsLoading(false);
    }
    loadData();

    if (webSocket && INIT_SOCKET) {
      console.log("on message initialized")

      webSocket.onmessage = (event: MessageEvent<any>) => {
        let dataBaseEventObject = JSON.parse(event.data);

        console.log(dataBaseEventObject);
        if (realTimeFlagRef.current) {
          console.log("IN");
          const newValue = !(reRenderRef.current)
          setReRender(newValue);
          reRenderRef.current = newValue;
        }
      }

      setWebSocket(webSocket);
      setInitSocket(false);
    }

    return (() => {
    })

  }, [props.deviceId, reRenderRef.current, realTimeFlagRef.current])


  return (
    <div className="flex flex-col min-h-[260px] font-mono self-center rounded-lg shadow-lg bg-gray-700 w-11/12 my-4 p-3">

      <div className="flex flex-row bg-gray-800 text-md rounded-lg p-3 w-5/12  self-start gap-6">
        <p className="self-center text-left text-md text-white font-bold">Sensor Devices</p>
        <div className="bg-gray-700 p-2 rounded-lg shadow-lg">
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-white before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-schn-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] "
            type="checkbox"
            id="flexSwitchCheckDefault"
            onChange={realTimeSwitchHandler}
          />
          <label
            className="inline-block pl-[0.15rem] hover:cursor-pointer text-white"
            htmlFor="flexSwitchCheckDefault"
          >Real-Time</label>
        </div>
      </div>
      {<Loader show={isLoading} />}
      {!isLoading ?
        <div className="cta-sensor-div flex flex-row space-x-3 overflow-x-auto self-center bg-gray-700 w-full p-1">
          {renderLst.length > 0 ? renderLst : <SideBarCard clickHandler={props.loadSensorChart} key={"placeHolder"} payload={{}} type={3} />}
        </div> : <></>
      }
    </div>

  )
}

export default SensorInfo

/*
      const handleSend = () => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("hello");
        } else if (client.readyState == WebSocket.CONNECTING) {
          // Wait for the open event, maybe do something with promises
          // depending on your use case. I believe in you developer!
          client.addEventListener('open', () => handleSend())
        }
      }
      
      

      

*/