import React, { MouseEventHandler } from 'react'
import ManageCard from './ManageCard'
import Loader from '../../Components/Loader/Loader'

interface ManageDevicesPropTypes {
    devices: any[],
    clickHandler: React.MouseEventHandler,
    isLoading: boolean
}

function ManageDevices(props: ManageDevicesPropTypes) {
    return (
        <>
            <div className="flex flex-col w-full bg-gray-900 pt-10 items-center">

                <div className="flex flex-col min-h-[260px] font-mono self-center rounded-lg shadow-lg bg-gray-700 w-11/12 min-w-0 my-4 p-3 justify-center">
                    <div className="p-4 self-center">
                        <p className="text-white font-bold text-lg px-5 w-full py-2 shadow-lg bg-gray-800 rounded-lg">Manage Edge devices</p>
                    </div>
                    {props.isLoading ? <div className="justify-self-center"><Loader show={props.isLoading} /></div> :
                        <div className="cta-sensor-div flex flex-row space-x-3 overflow-x-auto self-center bg-gray-700 w-full p-1">
                            {
                                props.devices.map((value, index) => {
                                    return (
                                        <ManageCard clickHandler={props.clickHandler} deleteHandler={() => { }} payload={value} type={1} />
                                    )
                                })
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