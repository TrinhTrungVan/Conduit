import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState } from "recoil";
import { userInfo } from "../recoil";

import axiosClient from "../api/axiosClient";

const Settings = () => {
    const navigate = useNavigate();

    const [userLogin, setUserLogin] = useRecoilState(userInfo);

    const [formValue, setFormValue] = useState({ ...userLogin, password: "" });

    const [disabled, setDisabled] = useState(false);

    const handleOnChange = (e) => {
        const field = e.target.name;
        setFormValue({ ...formValue, [field]: e.target.value });
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        try {
            setDisabled(true);
            const updateUser = async () => {
                const res = await axiosClient.put(
                    "/api/user",
                    { user: formValue },
                    {
                        headers: {
                            accept: "application/json",
                            authorization: `Token ${userLogin.token}`,
                        },
                    }
                );
                setUserLogin(res);
                setDisabled(false);
                navigate(`/@${userLogin.username}`);
                navigate(0); //reload
            };
            updateUser();
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem("userInfo");
        setUserLogin(null);
        navigate("/");
    };

    return (
        <div className='settings-page'>
            <div className='container page'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3 col-xs-12'>
                        <h1 className='text-xs-center'>Your Settings</h1>

                        <form>
                            <fieldset>
                                <fieldset className='form-group'>
                                    <input
                                        className='form-control'
                                        name='image'
                                        type='text'
                                        disabled={disabled}
                                        value={formValue.image ? formValue.image : ""}
                                        onChange={handleOnChange}
                                        placeholder='URL of profile picture'
                                    />
                                </fieldset>
                                <fieldset className='form-group'>
                                    <input
                                        className='form-control form-control-lg'
                                        name='username'
                                        type='text'
                                        disabled={disabled}
                                        value={formValue.username ? formValue.username : ""}
                                        onChange={handleOnChange}
                                        placeholder='Your Name'
                                    />
                                </fieldset>
                                <fieldset className='form-group'>
                                    <textarea
                                        className='form-control form-control-lg'
                                        rows='8'
                                        name='bio'
                                        disabled={disabled}
                                        value={formValue.bio ? formValue.bio : ""}
                                        onChange={handleOnChange}
                                        placeholder='Short bio about you'
                                    ></textarea>
                                </fieldset>
                                <fieldset className='form-group'>
                                    <input
                                        className='form-control form-control-lg'
                                        name='email'
                                        type='text'
                                        disabled={disabled}
                                        value={formValue.email ? formValue.email : ""}
                                        onChange={handleOnChange}
                                        placeholder='Email'
                                    />
                                </fieldset>
                                <fieldset className='form-group'>
                                    <input
                                        className='form-control form-control-lg'
                                        name='password'
                                        type='password'
                                        disabled={disabled}
                                        value={formValue.password ? formValue.password : ""}
                                        onChange={handleOnChange}
                                        placeholder='New password'
                                    />
                                </fieldset>
                                <button className={`btn btn-lg btn-primary pull-xs-right ${disabled ? "disabled" : ""}`} onClick={handleUpdateUser}>
                                    Update Settings
                                </button>
                            </fieldset>
                        </form>
                        <hr />
                        <button className='btn btn-outline-danger' onClick={handleLogOut}>
                            Or click here ot logout.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
