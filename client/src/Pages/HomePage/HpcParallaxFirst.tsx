import React from 'react'
import Parallax from './Parallax'
import { Link } from 'react-router-dom'

// https://i.postimg.cc/3k64bHbC/react.pn
function HpcParallaxFirst() {
    return (
        <>
            <Parallax image="../../../public/HeroPage.jpg">
                <div className="flex md:items-left flex-col md:pl-[100px] pl-[40px]">
                    <h1 className="text-white min-[600px]:text-8xl font-mono font-bold mb-3 pb-3 text-6xl">Sensor<b className="text-schn-500">Flow</b></h1>
                    <p className="text-white text-justify font-mono font-bold min-[600px]:text-xl w-9/12">SensorFlow is a powerful web app that simplifies the process of managing and controlling your IoT devices and sensors. With SensorFlow, you can easily provision and monitor your devices, visualize data in real-time, and gain insights to optimize performance. Get started today and take control of your IoT devices with SensorFlow.</p>
                    <Link className="text-center text-lg font-bold font-mono rounded-xl cursor-pointer bg-schn-500 text-white max-w-[150px] px-[15px] py-[8px] mt-4 hover:bg-schn-700 transition duration-500" to='/auth'>Sign in</Link>
                </div>
            </Parallax>
        </>
    )
}

export default HpcParallaxFirst