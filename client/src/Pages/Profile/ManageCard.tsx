import React, { useEffect, useState } from 'react'
import { MouseEventHandler } from 'react';
import { EdgeCardPayload, SensorCardPayload } from './ProfilePageUtils';


interface ManageCardPropType {
  clickHandler: React.MouseEventHandler,
  deleteHandler: MouseEventHandler,
  payload: EdgeCardPayload | SensorCardPayload | null,
  type: number,
}

enum CardType {
  EdgeDevice = 1,
  SensorDevice = 2,
  EmptyCard = 3
}

function getHumanReadableDate(date: string): string {
  date = date.slice(1)
  return  date.slice(6) + "/" + date.slice(3, 5) + "/" + date.slice(0, 2);
}


function ManageCard(props: ManageCardPropType) {

  let payload = props.payload;
  if (payload && props.type === CardType.SensorDevice && 'sensorId' in payload) {
    return (
      <div className={`p-4 flex-shrink-0 max-w-[340px] rounded-lg bg-gray-800 text-white font-mono w-11/12 my-2 hover:border-2 hover:border-schn-600 hover:scale-[1.025] transition duration-1000`}>
        <div className="flex flex-col mb-2">
          <div className="flex flex-col min-[1360px]:flex-row w-full">
            <img src="../../../public/sensor1.png" alt="Sensor icon" className={`mr-2 w-1/6 h-1/6 self-center min-[1360px]:self-start`} />
            <p className="mx-3 self-center text-md font-medium">{payload.sensorId ? payload.sensorId : "SENSOR_XXX"}</p>
            <div className="w-1/3 bg-red-400 rounded-md py-1 text-white justify-center flex place-self-center justify-self-end cursor-pointer hover:bg-red-700" onClick={props.deleteHandler} id={payload.sensorId + ":" + payload.deviceId}>Remove</div>
          </div>
          <p className="text-md mt-2">Last Reading: {payload.lastReading}</p>
        </div>
        <div className="flex justify-between">
          <p className={`text-sm text-gray-400`}>Time: {payload.lastReadingTime}</p>
          <p className={`text-sm text-gray-400`}>Date: {payload.lastReadingDate}</p>
        </div>
      </div>

    )
  }
  if (payload && props.type == CardType.EdgeDevice && 'deviceName' in payload) {
    return (
      <div className={`p-4 flex-shrink-0 max-w-[340px] rounded-lg bg-gray-800 text-white font-mono my-2 hover:border-2 hover:border-schn-600 hover:scale-[1.025] transition duration-1000`}>
        <div className="flex flex-col mb-2">
          <div className="flex flex-col min-[1360px]:flex-row w-full">
            <img src="../../../public/edge.png" alt="Sensor icon" className="mr-2 w-1/6 h-1/6 self-center min-[1360px]:self-start" />
            <p className="mx-3 self-center text-md font-medium">{payload.deviceName}</p>
            <div className="flex flex-col w-1/3 gap-2">
              <div className="text-white w-full bg-schn-400 rounded-md py-1 justify-center flex place-self-center justify-self-end cursor-pointer hover:bg-schn-700" onClick={props.clickHandler} id={payload.deviceId + ":" + payload.deviceName}>Show</div>
              <div className="text-white w-full bg-red-400 rounded-md py-1 justify-center flex place-self-center justify-self-end cursor-pointer hover:bg-red-700" onClick={props.deleteHandler} id={payload.deviceId + ":" + payload.deviceName}>Delete</div>
            </div>
          </div>
          <p className="text-md mt-2">Sensors: {payload.numSensors}</p>
        </div>
        <div className="flex justify-start">
          <p className="text-sm text-gray-400">Last updated: {payload.lastUpdated}</p>
        </div>
      </div>

    )
  }
  if (props.type == CardType.EmptyCard && props.payload === null) {
    return (
      <div className={`p-4 flex-shrink-0 max-w-[320px] rounded-lg bg-gray-800 text-white font-mono w-11/12 my-2 hover:border-2 hover:border-schn-600 hover:scale-[1.025] transition duration-1000`}>
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

export default ManageCard;