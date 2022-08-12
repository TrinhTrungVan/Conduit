import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { userInfo } from "../recoil";

import axiosClient from "../api/axiosClient";

import Comment from "../components/Comment";

const Article = () => {
    const userLogin = useRecoilValue(userInfo);

    const navigate = useNavigate();

    const { pathname } = useLocation();
    const slug = pathname.split("/")[2];

    const [article, setArticle] = useState(null);
    const [commentBody, setCommentBody] = useState("");
    const [comments, setComments] = useState([]);

    const [followDisabled, setFollowDisabled] = useState(false);
    const [likeDisabled, setLikeDisabled] = useState(false);

    const handleChangeCommentBody = (e) => {
        setCommentBody(e.target.value);
    };

    // Format created date
    const handleCreatedDate = (createdAt) => {
        const date = new Date(createdAt);
        const month = date.toLocaleString("en-US", {
            month: "long",
        });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day},${year}`;
    };

    const handleDeleteArticle = () => {
        const deleteArticle = async () => {
            await axiosClient.delete(`/api/articles/${slug}`, {
                headers: {
                    accept: "application/json",
                    authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                },
            });
            navigate("/");
        };
        deleteArticle();
    };

    const goToEditPage = () => {
        navigate(`/editor/${slug}`);
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        const postComment = async () => {
            const res = await axiosClient.post(
                `/api/articles/${slug}/comments`,
                {
                    comment: {
                        body: commentBody,
                    },
                },
                {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                    },
                }
            );
            setComments([...comments, res.comment]);
            setCommentBody("");
        };
        postComment();
    };

    const handleDeleteComment = (slug, id) => {
        try {
            const deleteComment = async () => {
                await axiosClient.delete(`/api/articles/${slug}/comments/${id}`, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                    },
                });
                const newComments = comments.filter((cmt) => cmt.id !== id);
                setComments(newComments);
            };
            deleteComment();
        } catch (error) {
            console.log(error);
        }
    };

    const [followed, setFollowed] = useState(null);
    const handleFollow = () => {
        if (!userLogin) {
            navigate("/login");
            return;
        }
        if (!followed) {
            try {
                setFollowDisabled(true);
                const follow = async () => {
                    await axiosClient.post(
                        `/api/profiles/${article.author.username}/follow`,
                        {},
                        {
                            headers: {
                                accept: "application/json",
                                authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                            },
                        }
                    );
                    setFollowed(true);
                    setFollowDisabled(false);
                };
                follow();
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                setFollowDisabled(true);
                const unfollow = async () => {
                    await axiosClient.delete(`/api/profiles/${article.author.username}/follow`, {
                        headers: {
                            accept: "application/json",
                            authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                        },
                    });
                    setFollowed(false);
                    setFollowDisabled(false);
                };
                unfollow();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(null);
    const handleLikeArticle = () => {
        if (!userLogin) {
            navigate("/login");
            return;
        }
        if (!liked) {
            try {
                setLikeDisabled(true);
                const likeArticle = async () => {
                    await axiosClient.post(
                        `/api/articles/${slug}/favorite`,
                        {},
                        {
                            headers: {
                                accept: "application/json",
                                authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                            },
                        }
                    );
                    setLikeDisabled(false);
                    setLikeCount(likeCount + 1);
                    setLiked(true);
                };
                likeArticle();
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                setLikeDisabled(true);
                const unlikeArticle = async () => {
                    await axiosClient.delete(`/api/articles/${slug}/favorite`, {
                        headers: {
                            accept: "application/json",
                            authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                        },
                    });
                    setLikeDisabled(false);
                    setLikeCount(likeCount - 1);
                    setLiked(false);
                };
                unlikeArticle();
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        try {
            const getArticle = async () => {
                const res = await axiosClient.get(`/api/articles/${slug}`, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin ? userLogin.token : ""}`,
                    },
                });
                setArticle(res.article);
                setFollowed(res.article.author.following);
                setLikeCount(res.article.favoritesCount);
                setLiked(res.article.favorited);
            };
            const getComments = async () => {
                const res = await axiosClient.get(`/api/articles/${slug}/comments`, {
                    headers: {
                        accept: "application/json",
                        authorization: `Token ${userLogin ? userLogin.token : ""}`,
                    },
                });
                setComments(res.comments);
            };
            getArticle();
            getComments();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        article && (
            <div className='article-page'>
                <div className='banner'>
                    <div className='container'>
                        <h1>{article.title}</h1>

                        <div className='article-meta'>
                            <div>
                                <img src={article.author.image} />
                            </div>
                            <div className='info'>
                                <span className='author'>{article.author.username}</span>
                                <span className='date'>{handleCreatedDate(article.createdAt)}</span>
                            </div>
                            {userLogin && userLogin.username === article.author.username ? (
                                <>
                                    <span className='ng-scope'>
                                        <a className='btn btn-secondary btn-sm' style={{ marginRight: "4px" }} onClick={goToEditPage}>
                                            <i className='ion-edit'></i> Edit Article
                                        </a>
                                        <button className='btn btn-outline-danger btn-sm' onClick={handleDeleteArticle}>
                                            <i className='ion-trash-a'></i> Delete Article
                                        </button>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <button
                                        className={`btn btn-sm btn${followed ? "-outline" : ""}-secondary ${followDisabled ? "disabled" : ""}`}
                                        onClick={handleFollow}
                                    >
                                        <i className='ion-plus-round'></i>
                                        &nbsp; {followed ? "Follow" : "Unfollow"} {article.author.username}
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        className={`btn btn-sm btn${!liked ? "-outline" : ""}-primary ${likeDisabled ? "disabled" : ""}`}
                                        onClick={handleLikeArticle}
                                    >
                                        <i className='ion-heart'></i>
                                        &nbsp; {liked ? "Unfavorite" : "Favorite"} Post <span className='counter'>({likeCount})</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className='container page'>
                    <div className='row article-content'>
                        <div className='col-md-12'>
                            <p>{article.title}</p>
                            <h2 id='introducing-ionic'>{article.description}</h2>
                            <p>{article.body}</p>
                            <ul className='tag-list'>
                                {article.tagList.map((tag, index) => (
                                    <li className='tag-default tag-pill tag-outline ng-binding ng-scope' key={index}>
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <hr />

                    <div className='article-actions'>
                        <div className='article-meta'>
                            <a href='profile.html'>
                                <img src={article.author.image} />
                            </a>
                            <div className='info'>
                                <a href='' className='author'>
                                    {article.author.username}
                                </a>
                                <span className='date'>{handleCreatedDate(article.createdAt)}</span>
                            </div>
                            {userLogin && userLogin.username === article.author.username ? (
                                <>
                                    <span className='ng-scope'>
                                        <a className='btn btn-outline-secondary btn-sm' style={{ marginRight: "4px" }} onClick={goToEditPage}>
                                            <i className='ion-edit'></i> Edit Article
                                        </a>
                                        <button className='btn btn-outline-danger btn-sm' onClick={handleDeleteArticle}>
                                            <i className='ion-trash-a'></i> Delete Article
                                        </button>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <button
                                        className={`btn btn-sm btn${followed ? "-outline" : ""}-secondary  ${followDisabled ? "disabled" : ""}`}
                                        onClick={handleFollow}
                                    >
                                        <i className='ion-plus-round'></i>
                                        &nbsp; {followed ? "Follow" : "Unfollow"} {article.author.username}
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        className={`btn btn-sm btn${!liked ? "-outline" : ""}-primary ${likeDisabled ? "disabled" : ""}`}
                                        onClick={handleLikeArticle}
                                    >
                                        <i className='ion-heart'></i>
                                        &nbsp; {liked ? "Unfavorite" : "Favorite"} Post <span className='counter'>({likeCount})</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-xs-12 col-md-8 offset-md-2'>
                            {userLogin && (
                                <form className='card comment-form'>
                                    <div className='card-block'>
                                        <textarea
                                            className='form-control'
                                            placeholder='Write a comment...'
                                            rows='3'
                                            value={commentBody}
                                            onChange={handleChangeCommentBody}
                                        ></textarea>
                                    </div>
                                    <div className='card-footer'>
                                        <img src={userLogin.username} className='comment-author-img' />
                                        <button className='btn btn-sm btn-primary' onClick={handlePostComment}>
                                            Post Comment
                                        </button>
                                    </div>
                                </form>
                            )}

                            {comments.map((comment, index) => (
                                <Comment key={index} data={comment} deleteComment={handleDeleteComment} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Article;
