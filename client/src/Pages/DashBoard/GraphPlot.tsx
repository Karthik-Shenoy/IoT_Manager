import React, { useEffect, useRef, useState } from 'react'
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import readings from './pdata';
import { TooltipProps } from 'recharts/types/component/Tooltip';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import "./DashBoard.css"

interface reading {
    sensorId: string,
    time: string,
    DO: Number,
    pH: Number,
    date: string
}



function CustomTooltip(props: TooltipProps<ValueType, NameType>) {
    let payload = props.payload ? (props.payload[0] ? props.payload[0].payload : null) : null;
    if (props.active) {
        return (
            <div className="p-3 rounded-lg bg-black text-white shadow-lg font-mono font-bold">
                <p className="intro">{`Time : ${payload ? payload.time.toString().slice(0, 6) : ""}`}</p>
                <p className="label">{`pH : ${payload ? payload.pH : ""}`}</p>
            </div>
        );
    }

    return null;
}

interface GraphPropType {
    sensorId: string,
    deviceName: string,
    realTimeFlag: boolean,
    data: reading[]
}

interface DateRange {
    min: string,
    max: string
}

function getDateInFormat(date: string, complement: boolean) {
    if (!complement) {
        let year = "20" + date.slice(1, 3);
        let month = date.slice(4, 6);
        let day = date.slice(7);
        return year + "-" + month + "-" + day;
    }
    let year = date.slice(2, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8);
    return year + "/" + month + "/" + day;
}

function GraphPlot(props: GraphPropType) {
    let [data, setData] = useState<reading[]>([]);
    let [dateRange, setDateRange] = useState({ min: '', max: '' })
    let [plotDate, setPlotDate] = useState("")
    let mainDivRef = useRef<HTMLDivElement>(null);

    const dateChangeListener = (event: React.ChangeEvent) => {
        let datePicker = event.target as HTMLInputElement;
        setPlotDate(getDateInFormat(datePicker.value, true))
    }

    useEffect(() => {
        let divElement = mainDivRef.current as HTMLDivElement;
        let devicePrompt = divElement.querySelector("#devicePrompt") as HTMLElement;
        let sensorPrompt = divElement.querySelector("#sensorPrompt") as HTMLElement;
        let choiceImage = divElement.querySelector("#choiceImage") as HTMLElement;
        let datePicker = divElement.querySelector("#datePicker") as HTMLInputElement;
        console.log("value: ", props.sensorId)
        let data: reading[] = [];
        if (props.data.length > 0) {
            setDateRange({
                min: getDateInFormat(props.data[0].date, false),
                max: getDateInFormat(props.data[props.data.length - 1].date, false)
            })
            setPlotDate(getDateInFormat(dateRange.min, true));
            if (datePicker.value === "") {
                datePicker.value = dateRange.min;
                
            }
            else{
                setPlotDate(getDateInFormat(datePicker.value, true));
            }
            if (props.sensorId == "no_value")
                datePicker.value = "";
            if (props.realTimeFlag) {
                datePicker.value = dateRange.max;
                setPlotDate(getDateInFormat(dateRange.max, true));
            }
        }
        for (let value of props.data) {
            if ((value.sensorId !== props.sensorId) || (plotDate !== value.date.slice(1)))
                continue;
            value.time = value.time.slice(0, 6);
            data.push(value);
        }

        setData(data);
        devicePrompt.style.animationName = "animateBoxGrow";
        devicePrompt.style.animationDuration = "1s";
        devicePrompt.style.animationTimingFunction = "ease-in-out";
        sensorPrompt.style.animationName = "animateBoxGrow";
        sensorPrompt.style.animationDuration = "1s";
        sensorPrompt.style.animationTimingFunction = "ease-in-out";
        datePicker.style.animationName = "animateBoxGrow";
        datePicker.style.animationDuration = "1s";
        datePicker.style.animationTimingFunction = "ease-in-out";
        if (choiceImage) {
            choiceImage.style.animationName = "animateBoxGrow";
            choiceImage.style.animationDuration = "1s";
            choiceImage.style.animationTimingFunction = "ease-in-out";
        }

        setTimeout(() => {
            devicePrompt.style.animationName = "";
            sensorPrompt.style.animationName = "";
            datePicker.style.animationName = "";
            if (choiceImage) {
                choiceImage.style.animationName = "";
            }
        }, 3000)

    }, [props, plotDate]);
    //props.sensorId, props.deviceName, props.data
    return (
        <div ref={mainDivRef} className="w-11/12 bg-gray-700 text-white  self-center  shadow-lg rounded-lg p-8 flex flex-col items-center">
            <div className="flex felx-row text-white text-lg font-bold font-mono mb-5">
                <p id="devicePrompt" className={`p-3 ${props.deviceName === "" ? "text-red-400" : "text-schn-500"} rounded-lg bg-gray-800 shadow-lg max-w-[350px] text-sm`}>{props.deviceName !== "" ? `Edge Device: ${props.deviceName}` : "Please choose a device from the Edge-Device list"} </p>
                <p id="sensorPrompt" className={`ml-5 p-3 ${props.sensorId === "no_value" ? "text-red-400" : "text-schn-500"} rounded-lg bg-gray-800 shadow-lg max-w-[350px] text-sm`}>{props.sensorId === "no_value" ? "Please choose a sensor from the sensor list" : `Sensor: ${props.sensorId}`}</p>
                <p className='self-center text-md ml-5 mr-2'>Date:</p>
                <input type="date"
                    id="datePicker"
                    className={`appearance-none border-2 ${(props.deviceName === "" || props.sensorId === "no_value") ? "border-red-400" : "border-schn-500"} text-gray-500 bg-gray-800 rounded-lg text-center outline-none hover:scale-[1.1] transition duration-1000 self-center p-2 text-sm`}
                    disabled={(props.deviceName === "" || props.sensorId === "no_value") ? true : false}
                    min={dateRange.min}
                    max={dateRange.max}
                    onChange={dateChangeListener} />


            </div>


            <div className="w-[500px] min-[940px]:w-[600px] min-[1100px]:w-[700px] min-[1300px]:w-[600px] h-[400px] flex items-center justify-center">
                {
                    (props.sensorId !== "no_value" && props.deviceName !== "") ?
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart width={800} height={500} data={data} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
                                <Area type="monotone" dataKey="pH" stroke="#008000" fill="#008000" strokeWidth={3} />
                                <CartesianGrid stroke="#FFFFFF" strokeDasharray="1 1" strokeOpacity={0.2} />
                                <XAxis dataKey="time" stroke="#FFFFFF" />
                                <YAxis stroke="#FFFFFF" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                        : <></>
                }
            </div>

        </div>
    )
}

export default GraphPlot

/*
<div id="choiceImage" className="bg-gray-800 h-full w-8/12 rounded-xl shadow-lg flex items-center justify-center"><img src="../../../choice.png"  className="max-w-[350px] max-h-[350px] invert-[65%]" alt="choice" /></div>
*/