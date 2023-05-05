import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';

enum AuthError {
  // all the signup errors have error code 1X
  UserAlreadyExists = 10,
  // all the signin errors have error code 2X
  WrongEmail = 20,
  WrongPassword = 21


}

const Auth = () => {
  const [isSignin, setIsSignin] = useState(true);
  const [increaseSize, setIncreaseSize] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  let [passwordNotif, setPasswordNotif] = useState("");
  const { userUID, setUserUID } = useContext(UserContext);
  let naviagte = useNavigate();
  const handleSwitch = () => {
    if (isSignin) {
      setIncreaseSize(!increaseSize);
      setTimeout(() => setIsSignin(!isSignin), 1000);
    }
    else {
      setIsSignin(!isSignin);
      setIncreaseSize(!increaseSize);
    }

  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector("#email") as HTMLInputElement;
    const passwordInput = form.querySelector("#password") as HTMLInputElement;
    const userNameInput = form.querySelector("#userName") as HTMLInputElement;

    const sendData = async () => {
      setIsLoading(true);
      if (isSignin) {
        const response = await fetch("/data/signin", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
          })
        })
        const thisResponse = await response.json();
        const thisUID = thisResponse.UID;
        console.log(thisUID)
        switch (thisUID) {
          case AuthError.WrongEmail:
            setPasswordNotif("");
            setPasswordNotif("the entered email is not registered");
            break;
          case AuthError.WrongPassword:
            setPasswordNotif("");
            setPasswordNotif("the entered password is wrong !");
            break;
          default:
            setUserUID(thisUID);
            break;
        }
        console.log(passwordNotif)
        return;
      }

      const response = await fetch("/data/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          name: userNameInput.value,
          email: emailInput.value,
          password: passwordInput.value
        })
      })
      const thisUID = await response.json();
    }

    let sendDataPromise = sendData();
    sendDataPromise.then(() => {
      naviagte("/dashboard");
      setIsLoading(false);
    })
  };

  const handleOnChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;

    if (element.id === "password") {
      const password = element.value;
      if (password.length < 8) {
        setPasswordNotif("Password should be at least 8 characters long");
      }
      else {
        setPasswordNotif("");
      }
    }
  }

  return (
    <div className="flex font-mono md:items-center justify-center h-screen bg-black p-10">
      {
        isLoading ? <Loader show={isLoading} /> :
          <form onSubmit={handleSubmit} className={`w-full ${increaseSize ? "max-w-[700px] h-[576px]" : "max-w-[600px] h-[400px]"} bg-black border-2 border-schn-600 rounded-lg transition-all duration-1000 ease-in `} action="/dashboard" >
            <div className="flex flex-row">
              <div className="px-8 py-6">
                <h2 className="text-white border-2 border-schn-500 p-1 rounded-lg font-bold text-2xl text-center mb-6">Sign{isSignin ? <b className="text-schn-500">In</b> : <b className="text-schn-500">Up</b>}</h2>
                {!isSignin && (

                  <div className="mt-4">
                    <label htmlFor="userName" className="block text-white font-bold mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="userName"
                      className="block w-full bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500"
                      required
                    />
                  </div>

                )}
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
                    className={`block w-full bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:bg-white ${passwordNotif !== "" ? "border-2 border-red-600" : ""}`}
                    required
                    onChange={handleOnChange}
                  />
                </div>

                <div className={`password-notification bg-red-500 ${(passwordNotif !== "") ? "scale-1" : "scale-0"} text-white mt-3 py-1 px-2 rounded-md text-sm z-10 transition-all duration-500`}>
                  {passwordNotif}
                </div>


                {!isSignin && (

                  <div className="mt-4">
                    <label htmlFor="confirmPassword" className="block text-white font-bold mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="block w-full bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500"
                      required
                    />
                  </div>

                )}
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-bold tracking-wide hover:bg-gray-700 hover:text-white transition duration-300"
                  >
                    {isSignin ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <button
                    type="reset"
                    className="text-white hover:text-schn-500"
                    onClick={handleSwitch}
                  >
                    {isSignin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                  </button>
                </div>
              </div>
              <img src="../../../public/logo.jpg" className={`w-6/12 ${increaseSize? "h-[576px]":"h-[400px]"} rounded-lg ml-auto max-[780px]:hidden transition-all duration-1000 ease-in`} />
            </div>
          </form>
      }
    </div>

  );
};

export default Auth;
