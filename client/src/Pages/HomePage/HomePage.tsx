import React from 'react';
import './HomePage.css'
import HpcParallaxFirst from './HpcParallaxFirst';

export default function HomePage() {
    return (
        <>
            <div className="flex flex-col flex-none w-screen">
                <HpcParallaxFirst/>
            </div>
        </>
    );
}

