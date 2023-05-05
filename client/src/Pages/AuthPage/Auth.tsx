import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';
import SignInComponent from './SignInComponent';
import SignUpComponent from './SignUpComponent';
import AuthError from '../../../../utils';



const Auth = () => {
  const [isSignin, setIsSignin] = useState(true);
  const [increaseSize, setIncreaseSize] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [authNotif, setAuthNotif] = useState("");
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

  const userSignIn = (userEmail: string, userPassword: string) => {
    const sendData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/data/signin", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            email: userEmail,
            password: userPassword
          })
        })
        const thisResponse = await response.json();
        const thisUID = thisResponse.UID;
        console.log(thisUID)
        switch (thisUID) {
          case AuthError.WrongEmail:
            setAuthNotif("");
            setAuthNotif("the entered email is not registered");
            return null;
          case AuthError.WrongPassword:
            setAuthNotif("");
            setAuthNotif("the entered password is wrong !");
            return null;
          default:
            setUserUID(thisUID);
            return thisUID;
        }
      } catch (error) {
        setAuthNotif("");
        setAuthNotif("Our servers are experiencing issues, please try again later.");
        return null
      }
    }

    let sendDataPromise = sendData();
    sendDataPromise.then((result) => {
      if (result) {
        naviagte("/dashboard")
      }
      setIsLoading(false)
    })
  }

  const userSignUp = (newUserName: string, newUserEmail: string, newUserPassword: string) => {

    setIsLoading(true);
    const sendData = async () => {
        try {
            const response = await fetch("/data/signup", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name: newUserName,
                    email: newUserEmail,
                    password: newUserPassword
                })
            })
            const thisResponse = await response.json();
            const thisUID = thisResponse.UID;
            console.log(thisUID)
            switch (thisUID) {
                case AuthError.UserAlreadyExists:
                    setAuthNotif("");
                    setAuthNotif("the entered email is already");
                    return null;
                default:
                    setUserUID(thisUID);
                    return thisUID;
            }
        } catch (error) {
            setAuthNotif("");
            setAuthNotif("Our servers are experiencing issues, please try again later.");
            return null
        }
    }
    let sendDataPromise = sendData();
    sendDataPromise.then((result) => {
        if (result) {
            naviagte("/dashboard")
        }
        setIsLoading(false)
    })
}

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector("#email") as HTMLInputElement;
    const passwordInput = form.querySelector("#password") as HTMLInputElement;
    const userNameInput = form.querySelector("#userName") as HTMLInputElement;
    if(isSignin){
      userSignIn(emailInput.value, passwordInput.value)
    }
    else{
      userSignUp(userNameInput.value, emailInput.value, passwordInput.value)
    }

  }
  const handleOnChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;

    if (element.id === "password") {
      const password = element.value;
      if (password.length < 8) {
        setAuthNotif("Password should be at least 8 characters long");
      }
      else {
        setAuthNotif("");
      }
    }
  }

  return (
    <div className="flex font-mono md:items-center justify-center h-screen bg-black p-10">
      {
        isLoading ? <Loader show={isLoading} /> :
          <form onSubmit={handleSubmit} className={`w-full ${increaseSize ? "max-w-[700px] h-[600px]" : "max-w-[600px] h-[450px]"} bg-black border-2 border-schn-600 rounded-lg transition-all duration-1000 ease-in `} action="/dashboard" >
            <div className="flex flex-row">
              {
                isSignin ?
                  <SignInComponent handleSwitch={handleSwitch}
                    signInNotif={authNotif}
                    handleOnChange={handleOnChange} /> :
                  <SignUpComponent handleSwitch={handleSwitch}
                    signUpNotif={authNotif}
                    handleOnChange={handleOnChange} />
              }
              <img src="../../../public/logo.jpg" className={`w-6/12 ${increaseSize ? "h-[600px]" : "h-[450px]"} rounded-lg ml-auto max-[780px]:hidden transition-all duration-1000 ease-in`} />
            </div>
          </form>
      }
    </div>

  );
};

export default Auth;
