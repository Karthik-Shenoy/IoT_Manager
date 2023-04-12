import React, { MouseEventHandler, useEffect, useState } from 'react'
import GraphPlot from './GraphPlot'
import SensorInfo from './SensorInfo/SensorInfo'

interface GraphViewPropType {
  sensorId: string,
  deviceId: string,
  deviceName: string,
  loadSensorChart: MouseEventHandler,
}

function GraphView(props: GraphViewPropType) {
  let [data, setData] = useState([]);
  let [realTimeFlag, setRealTimeFlag] = useState(false);
  let getAndSetData = (data: any) => {
    setData(data);
  }

  const notifyRealTime = (flag: boolean) => {
    setRealTimeFlag(flag)
  }

  return (
    <div className="w-9/12 max-[800px]:w-11/12 h-full flex flex-col justify-center ">
      <GraphPlot sensorId={props.sensorId} deviceName={props.deviceName} data={data} realTimeFlag={realTimeFlag} />
      <SensorInfo deviceId={props.deviceId}
        loadSensorChart={props.loadSensorChart}
        getAndSetData={getAndSetData}
        notifyRealTime={notifyRealTime} />
    </div>
  )
}

export default GraphView