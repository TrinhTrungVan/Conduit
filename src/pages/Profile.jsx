import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { userInfo } from "../recoil";

import axiosClient from "../api/axiosClient";

import ArticlePreview from "../components/ArticlePreview";
import Loading from "../components/Loading";

const Profile = () => {
    const userLogin = useRecoilValue(userInfo);

    const { pathname } = useLocation();
    const username = pathname.split("@")[1];

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [isMyArticles, setIsMyArticles] = useState(true);
    const handleOnClick = () => {
        setIsMyArticles(!isMyArticles);
    };

    const [myArticles, setMyArticles] = useState([]);
    const [favoritedArticles, setFavoritedArticles] = useState([]);

    const navigate = useNavigate();
    const goToEditProfilePage = () => {
        navigate("/settings");
    };

    const [follow, setFollow] = useState(null);
    const handleFollow = () => {
        if (follow) {
            try {
                setDisabled(true);
                const follow = async () => {
                    await axiosClient.post(
                        `/api/profiles/${username}/follow`,
                        {},
                        {
                            headers: {
                                accept: "application/json",
                                authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                            },
                        }
                    );
                    setFollow(!follow);
                    setDisabled(false);
                };
                follow();
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                setDisabled(true);
                const unfollow = async () => {
                    await axiosClient.delete(`/api/profiles/${username}/follow`, {
                        headers: {
                            accept: "application/json",
                            authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                        },
                    });
                    setFollow(!follow);
                    setDisabled(false);
                };
                unfollow();
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        try {
            const getData = async () => {
                const user = await axiosClient.get(`/api/profiles/${username}`, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                    },
                });

                const myArticles = await axiosClient.get(`/api/articles?author=${username}`, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                    },
                });

                const favoArticles = await axiosClient.get(`/api/articles/feed`, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                    },
                });

                setMyArticles(myArticles.articles);
                setUser(user.profile);
                setFollow(user.following);
                setFavoritedArticles(favoArticles.articles);
                setLoading(false);
            };
            getData();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div className='profile-page'>
            <div className='user-info'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-xs-12 col-md-10 offset-md-1'>
                            <img src={user.image} className='user-img' />
                            <h4>{user.username}</h4>
                            <p>{user.bio}</p>

                            {userLogin.username === username ? (
                                <a ui-sref='app.settings' className='btn btn-sm btn-outline-secondary action-btn' onClick={goToEditProfilePage}>
                                    <i className='ion-gear-a'></i> Edit Profile Settings
                                </a>
                            ) : (
                                <button className={`btn btn-sm btn-outline-secondary action-btn ${disabled ? "disabled" : ""}`} onClick={handleFollow}>
                                    <i className='ion-plus-round'></i>
                                    &nbsp; {follow ? "Unfollow" : "Follow"} {user.username}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='container'>
                <div className='row'>
                    <div className='col-xs-12 col-md-10 offset-md-1'>
                        <div className='articles-toggle'>
                            <ul className='nav nav-pills outline-active'>
                                <li className='nav-item'>
                                    <div className={`nav-link ${isMyArticles ? "active" : ""}`} onClick={handleOnClick}>
                                        My Articles
                                    </div>
                                </li>
                                <li className='nav-item'>
                                    <div className={`nav-link ${isMyArticles ? "" : "active"}`} onClick={handleOnClick}>
                                        Favorited Articles
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {loading && <Loading />}

                        {isMyArticles
                            ? myArticles.length === 0
                                ? !loading && <div className='article-preview'>No articles are here... yet.</div>
                                : !loading && myArticles.map((item, index) => <ArticlePreview key={index} data={item} />)
                            : favoritedArticles.length === 0
                            ? !loading && <div className='article-preview'>No articles are here... yet.</div>
                            : !loading && favoritedArticles.map((item, index) => <ArticlePreview key={index} data={item} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
