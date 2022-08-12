import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "../recoil/index.js";

import axiosClient from "../api/axiosClient";

const Auth = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isLoginPage = pathname === "/login";

    const [userLogin, setUserLogin] = useRecoilState(userInfo);

    const [inputName, setInputName] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);

    const handleOnChangeName = (e) => {
        setInputName(e.target.value);
    };
    const handleOnChangeEmail = (e) => {
        setInputEmail(e.target.value);
    };
    const handleOnChangePassword = (e) => {
        setInputPassword(e.target.value);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const data = {
            user: {
                email: inputEmail,
                password: inputPassword,
            },
        };
        try {
            const result = await axiosClient.post("/api/users/login", data);
            localStorage.setItem("userInfo", JSON.stringify(result.user));
            setUserLogin(result.user);
            navigate("/");
        } catch (error) {
            if (error.response.status === 403) {
                setErrorMessage("Email or password is invalid.");
            } else {
                setErrorMessage("Error.");
            }
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const data = {
            user: {
                username: inputName,
                email: inputEmail,
                password: inputPassword,
            },
        };
        try {
            const result = await axiosClient.post("/api/users", data);
            localStorage.setItem("userInfo", JSON.stringify(result.user));
            setUserLogin(result.user);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnClick = () => {
        if (isLoginPage) {
            navigate("/register");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className='auth-page'>
            <div className='container page'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3 col-xs-12'>
                        <h1 className='text-xs-center'>{isLoginPage ? "Sign in" : "Sign up"}</h1>
                        <p className='text-xs-center' onClick={handleOnClick}>
                            <a href=''>Have an account?</a>
                        </p>

                        {errorMessage && (
                            <ul className='error-messages'>
                                <li>{errorMessage}</li>
                            </ul>
                        )}

                        <form>
                            {!isLoginPage && (
                                <fieldset className='form-group'>
                                    <input
                                        className='form-control form-control-lg'
                                        value={inputName}
                                        onChange={handleOnChangeName}
                                        type='text'
                                        placeholder='Your Name'
                                    />
                                </fieldset>
                            )}
                            <fieldset className='form-group'>
                                <input
                                    className='form-control form-control-lg'
                                    value={inputEmail}
                                    onChange={handleOnChangeEmail}
                                    type='text'
                                    placeholder='Email'
                                />
                            </fieldset>
                            <fieldset className='form-group'>
                                <input
                                    className='form-control form-control-lg'
                                    value={inputPassword}
                                    onChange={handleOnChangePassword}
                                    type='password'
                                    placeholder='Password'
                                />
                            </fieldset>
                            <button className='btn btn-lg btn-primary pull-xs-right' onClick={isLoginPage ? handleSignIn : handleSignUp}>
                                {isLoginPage ? "Sign in" : "Sign up"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
