import React, { useContext, useEffect, useState } from "react";
import AuthError from '../../../../utils'
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

interface SignInComponentPropType {
    handleSwitch: React.MouseEventHandler,
    signInNotif: string,
    handleOnChange: React.ChangeEventHandler
}
function SignInComponent(props: SignInComponentPropType) {
    return (
        <>
            <div className="px-8 py-6">
                <h2 className="text-white border-2 border-schn-500 p-1 rounded-lg font-bold text-2xl text-center mb-6">Sign <b className="text-schn-500">In</b></h2>
                <div className='mt-4'>
                    <label htmlFor="email" className="block text-white font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="block w-full bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500"
                        required
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="password" className="block text-white font-bold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={`block w-full bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:bg-white ${props.signInNotif !== "" ? "border-2 border-red-600" : ""}`}
                        required
                        onChange={props.handleOnChange}
                    />
                </div>

                <div className={`password-notification bg-red-500 ${(props.signInNotif !== "") ? "scale-1" : "scale-0"} text-white mt-3 py-1 px-2 rounded-md text-sm z-10 transition-all duration-500`}>
                    {props.signInNotif}
                </div>


                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-bold tracking-wide hover:bg-gray-700 hover:text-white transition duration-300"
                    >
                        Sign In
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <button
                        type="reset"
                        className="text-white hover:text-schn-500"
                        onClick={props.handleSwitch}
                    >
                        Need an account? Sign Up
                    </button>
                </div>
            </div>
        </>
    )
}

export default SignInComponent;