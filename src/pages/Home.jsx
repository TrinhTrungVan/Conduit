import React, { useState, useEffect } from "react";

import { useRecoilValue } from "recoil";
import { userInfo } from "../recoil";

import axiosClient from "../api/axiosClient";

import ArticlePreview from "../components/ArticlePreview";
import Loading from "../components/Loading";

const Home = () => {
    const userLogin = useRecoilValue(userInfo);

    const [loading, setLoading] = useState(false);

    const [tabShowing, setTabShowing] = useState(userLogin ? "YourFeed" : "GlobalFeed");
    const [dataShowing, setDataShowing] = useState([]);

    const handleShowFeed = () => {
        setLoading(true);
        setTabShowing("YourFeed");
        const getFeed = async () => {
            try {
                const res = await axiosClient.get(`/api/articles?author=${userLogin.username}`, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin ? userLogin.token : ""}`,
                    },
                });
                setDataShowing(res.articles);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getFeed();
    };

    const handleShowArticles = () => {
        setLoading(true);
        setTabShowing("GlobalFeed");
        try {
            const getArticles = async () => {
                const res = await axiosClient.get("/api/articles");
                setDataShowing(res.articles);
                setLoading(false);
            };
            getArticles();
        } catch (error) {
            console.log(error);
        }
    };
    const handleShowArticlesWithTag = (e) => {
        e.preventDefault();
        setLoading(true);
        setTabShowing("TabFeed");
        setShowTabArticlesWithTag(true);
        const tag = e.target.dataset.value;
        setTagName(tag);
        try {
            const getPopularTag = async () => {
                const res = await axiosClient.get(`api/articles?limit=10&offset=0&tag=${tag}`);
                setDataShowing(res.articles);
                setLoading(false);
            };
            getPopularTag();
        } catch (error) {
            console.log(error);
        }
    };

    const [tagList, setTagList] = useState([]);
    const [tagName, setTagName] = useState("");
    const [showTabArticlesWithTag, setShowTabArticlesWithTag] = useState(false);

    useEffect(() => {
        setLoading(true);
        const getFeed = async () => {
            try {
                const url = `/api/articles${userLogin ? `?author=${userLogin.username}` : ""}`;
                const res = await axiosClient.get(url, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin ? userLogin.token : ""}`,
                    },
                });
                setDataShowing(res.articles);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        const getTagList = async () => {
            try {
                const res = await axiosClient.get("/api/tags", {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin ? userLogin.token : ""}`,
                    },
                });
                setTagList(res.tags);
            } catch (error) {
                console.log(error);
            }
        };
        getFeed();
        getTagList();
    }, []);

    return (
        <div className='home-page'>
            <div className='banner'>
                <div className='container'>
                    <h1 className='logo-font'>conduit</h1>
                    <p>A place to share your knowledge.</p>
                </div>
            </div>

            <div className='container page'>
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='feed-toggle'>
                            <ul className='nav nav-pills outline-active'>
                                {userLogin && (
                                    <li className='nav-item' onClick={handleShowFeed}>
                                        <div className={`nav-link ${"YourFeed" === tabShowing ? "active" : ""}`}>Your Feed</div>
                                    </li>
                                )}
                                <li className='nav-item' onClick={handleShowArticles}>
                                    <div className={`nav-link ${"GlobalFeed" === tabShowing ? "active" : ""}`}>Global Feed</div>
                                </li>

                                {showTabArticlesWithTag ? (
                                    <li className='nav-item'>
                                        <div className={`nav-link ${"TabFeed" === tabShowing ? "active" : ""}`}>{`#${tagName}`}</div>
                                    </li>
                                ) : null}
                            </ul>
                        </div>

                        {loading && <Loading />}

                        {!userLogin && dataShowing.length === 0
                            ? !loading && <div className='article-preview'>No articles are here... yet.</div>
                            : !loading && dataShowing.map((item, index) => <ArticlePreview key={index} data={item} />)}

                        {userLogin && dataShowing && dataShowing.length === 0
                            ? !loading && <div className='article-preview'>No articles are here... yet.</div>
                            : !loading && dataShowing.map((item, index) => <ArticlePreview key={index} data={item} />)}
                    </div>

                    <div className='col-md-3'>
                        <div className='sidebar'>
                            <p>Popular Tags</p>
                            <div className='tag-list'>
                                {tagList.map((tag, index) => (
                                    <a href='' key={index} className='tag-pill tag-default' data-value={tag} onClick={handleShowArticlesWithTag}>
                                        {tag}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
