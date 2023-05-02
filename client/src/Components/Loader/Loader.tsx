import React, { useEffect, useState, useRef } from 'react'

interface LoaderPropType {
	show: boolean
}

function Loader(props: LoaderPropType) {
	let nodeRef = useRef<HTMLDivElement>(null);
	return (
		<>
			<div ref={nodeRef} className={`w-full min-h-[170px] z-50 flex items-center justify-center opacity-75`}>
				<svg
					className="animate-spin h-12 w-12 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4" />
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 110-16 8 8 0 010 16zm0-4a4 4 0 100-8 4 4 0 000 8z" />
				</svg>
			</div>
		</>
	)
}

export default Loader