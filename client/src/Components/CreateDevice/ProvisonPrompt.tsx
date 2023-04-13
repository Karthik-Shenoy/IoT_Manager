import React from 'react'

interface ProvisonPromptPropType {
  closeHandler: React.MouseEventHandler
}
function ProvisonPrompt(props: ProvisonPromptPropType) {
  return (
    <>
      <div className="flex flex-row">
        <div className="px-8 py-6">
          <h2 className="text-white border-2 border-schn-500 p-1 rounded-lg font-bold text-2xl text-center mb-6">Provisioned<b className="text-schn-500">Device</b></h2>
          <p className="block text-white  font-bold my-2">
            The sesnsor has been Provisioned !
          </p>
          <button onClick={props.closeHandler} className="mt-4 ml-2 p-2 w-1/3 bg-gray-800 hover:text-red-500 hover:scale-[1.05] rounded-lg shadow-lg text-white font-bold transition-all duration-1000">
            close
          </button>
        </div>
      </div>
    </>
  )
}

export default ProvisonPrompt