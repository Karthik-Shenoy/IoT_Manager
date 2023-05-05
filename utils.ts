enum AuthError {
    // all the signup errors have error code 1X
    UserAlreadyExists = 10,
    // all the signin errors have error code 2X
    WrongEmail = 20,
    WrongPassword = 21
}

export default  AuthError;