import React, { MouseEventHandler, useEffect, useState } from 'react'
import GraphPlot from './GraphPlot'
import SensorInfo from './SensorInfo/SensorInfo'
import { CenterViewContextType } from './DashBoardTypes'

interface CenterViewPropType {
  loadSensorChart: MouseEventHandler,
  setRefreshCallbacks: React.Dispatch<React.SetStateAction<Set<Function>>>
  openDialog: Function
  centerViewContext: CenterViewContextType
}

function CenterView(props: CenterViewPropType) {
  let [data, setData] = useState<Map<string, any>>();
  let [realTimeFlag, setRealTimeFlag] = useState(false);

  let getAndSetData = (data: Map<string, any[]>) => {
    setData(data);
  }

  const notifyRealTime = (flag: boolean) => {
    setRealTimeFlag(flag)
  }

  

  return (
    <div className="w-9/12 max-[800px]:w-11/12 h-full flex flex-col justify-center ">
      <GraphPlot sensorId={props.centerViewContext.sensorId} deviceName={props.centerViewContext.deviceName} data={data} realTimeFlag={realTimeFlag} />
      <SensorInfo deviceId={props.centerViewContext.deviceId}
        loadSensorChart={props.loadSensorChart}
        getAndSetData={getAndSetData}
        notifyRealTime={notifyRealTime}
        setRefreshCallbacks={props.setRefreshCallbacks} 
        openDialog={props.openDialog}
        reRender={props.centerViewContext.reRender}/>
    </div>
  )
}

export default CenterView