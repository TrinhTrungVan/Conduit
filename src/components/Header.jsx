import React from "react";
import { Link, useLocation } from "react-router-dom";

import { useRecoilValue } from "recoil";

import { userInfo } from "../recoil";

const Header = () => {
    const userLogin = useRecoilValue(userInfo);

    const { pathname } = useLocation();
    const checkActive = (input) => {
        return input === pathname ? "active" : "";
    };

    return (
        <>
            <nav className='navbar navbar-light'>
                <div className='container'>
                    <a className='navbar-brand' href='#'>
                        conduit
                    </a>
                    <ul className='nav navbar-nav pull-xs-right'>
                        <li className='nav-item'>
                            <Link className={`nav-link ${checkActive("/")}`} to='/'>
                                Home
                            </Link>
                        </li>
                        {userLogin && (
                            <>
                                <li className='nav-item'>
                                    <Link className={`nav-link ${checkActive("/editor")}`} to='/editor'>
                                        <i className='ion-compose'></i>&nbsp;New Article
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className={`nav-link ${checkActive("/settings")}`} to='/settings'>
                                        <i className='ion-gear-a'></i>&nbsp;Settings
                                    </Link>
                                </li>
                            </>
                        )}
                        {!userLogin && (
                            <>
                                <li className='nav-item'>
                                    <Link className={`nav-link ${checkActive("/login")}`} to='/login'>
                                        Sign in
                                    </Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className={`nav-link ${checkActive("/register")}`} to='/register'>
                                        Sign up
                                    </Link>
                                </li>
                            </>
                        )}
                        {userLogin && (
                            <li className='nav-item'>
                                <Link className={`nav-link ${checkActive(`/@${userLogin.username}`)}`} to={`/@${userLogin.username}`}>
                                    <img className='user-pic' src={userLogin.image} />
                                    {userLogin.username}
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Header;
