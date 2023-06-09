import React, { useEffect, useState } from 'react'
import { MouseEventHandler } from 'react';


interface SideBarCardPropType {
  clickHandler: MouseEventHandler,
  payload: any,
  type: number,
}
enum CardType {
  EdgeDevice = 1,
  SensorDevice = 2,
  EmptyCard
}


function SideBarCard(props: SideBarCardPropType) {
  
  let payload = props.payload;
  if (props.type == CardType.SensorDevice) {
    return (
      <div className={`p-4 flex-shrink-0 max-w-[340px] rounded-lg bg-gray-800 ${props.payload.isProvisioned ? "text-white" : "text-red-400"} font-mono w-11/12 my-2 hover:border-2 hover:${props.payload.isProvisioned? "border-schn-600" : "border-red-600"} hover:scale-[1.025] transition duration-1000`}>
        <div className="flex flex-col mb-2">
          <div className="flex flex-col min-[1360px]:flex-row w-full">
            <img src="../../../public/sensor1.png" alt="Sensor icon" className={`mr-2 w-1/6 h-1/6 self-center min-[1360px]:self-start ${props.payload.isProvisioned? "":"hue-rotate-[140deg] saturate-150"}`} />
            <p className="mx-3 self-center text-md font-medium">{payload.sensorId ? payload.sensorId : "SENSOR_XXX"}</p>
            <div className="w-1/3 bg-schn-400 rounded-md py-1 text-white justify-center flex place-self-center justify-self-end cursor-pointer hover:bg-schn-700" onClick={props.clickHandler} id={payload.sensorId}>{props.payload.isProvisioned? "View":"Provison"}</div>
          </div>
          <p className="text-md mt-2">Last Reading: {payload.data}</p>
        </div>
        <div className="flex justify-between">
          <p className={`text-sm ${props.payload.isProvisioned? "text-gray-400":"text-red-400"}`}>Time: {payload.time}</p>
          <p className={`text-sm ${props.payload.isProvisioned? "text-gray-400":"text-red-400"}`}>Date: {payload.date}</p>
        </div>
      </div>

    )
  }
  if (props.type == CardType.EdgeDevice) {
    return (
      <div className={`p-4 flex-shrink-0 max-w-[340px] rounded-lg bg-gray-800 text-white font-mono my-2 hover:border-2 hover:border-schn-600 hover:scale-[1.025] transition duration-1000`}>
        <div className="flex flex-col mb-2">
          <div className="flex flex-col min-[1360px]:flex-row w-full">
            <img src="../../../public/edge.png" alt="Sensor icon" className="mr-2 w-1/6 h-1/6 self-center min-[1360px]:self-start" />
            <p className="mx-3 self-center text-md font-medium">{props.payload.deviceName}</p>
            <div className="text-white w-1/3 bg-schn-400 rounded-md py-1 justify-center flex place-self-center justify-self-end cursor-pointer hover:bg-schn-700" onClick={props.clickHandler} id={payload.deviceId + ":" + payload.deviceName}>View</div>
          </div>
          <p className="text-md mt-2">Sensors: 4</p>
        </div>
        <div className="flex justify-start">
          <p className="text-sm text-gray-400">Last updated: 07/04/2023 12:30</p>
        </div>
      </div>

    )
  }
  if (props.type == CardType.EmptyCard) {
    return (
      <div className={`p-4 flex-shrink-0 max-w-[320px] rounded-lg bg-gray-800 text-white font-mono "w-11/12" my-2 hover:border-2 hover:border-schn-600 hover:scale-[1.025] transition duration-1000`}>
        <div className="flex flex-col mb-2">
          <div className="flex flex-row w-full justify-center items-center">
            <img src="../../../public/no-connection.png" alt="Sensor icon" className="mr-2 w-1/6 h-1/6 invert-[60%]" />
            <p className="mx-3 text-md font-medium">No sensors are connected to the device</p>
          </div>
        </div>
      </div>

    )
  }
  return (<>
  </>)
}

export default SideBarCard;