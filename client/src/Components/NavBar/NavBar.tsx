import React, { useContext } from 'react'
import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';

export default function NavBar() {
    let location = useLocation()
    let {userUID} = useContext(UserContext);
    let colorScheme = location.pathname === "/" || location.pathname === "/auth" ? "bg-black" : "bg-gray-900";
    return (
        <>
            <nav className={`z-20 ${colorScheme} flex items-center py-4 shadow-lg sticky top-0 w-full`}>
                <div className="text-lg text-white mx-auto font-mono font-black">
                    <p className="cursor-default font-bold">Sensor<b className="text-schn-500">Flow</b></p>
                </div>
                <div className="nav-links flex items-center flex-col sm:flex-row">
                    <Link to="/" className="rounded-lg px-5 py-2 text-white mx-3 hover:bg-schn-600 hover:shadow-md transition duration-500 font-mono">Home</Link>
                    <Link to="/dashboard" className="rounded-lg px-5 py-2 text-white mx-3 hover:bg-schn-600 hover:shadow-md transition duration-500 font-mono">DashBoard</Link>
                    {userUID!== "" && <Link to="/profile" className="rounded-lg px-5 py-2 text-white mx-3 hover:bg-schn-600 hover:shadow-md transition duration-500 font-mono">Profile</Link>}
                </div>
                <div className="social-links flex mx-auto">
                    <a href="/" className="text-beige-800 mx-4 hover:text-beige-600">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="/" className="text-beige-800 mx-4 hover:text-beige-600">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="/" className="text-beige-800 mx-4 hover:text-beige-600">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </nav>
        </>
    )
}
