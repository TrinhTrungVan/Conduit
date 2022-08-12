import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

import Tag from "./Tag";

import { useRecoilValue } from "recoil";
import { userInfo } from "../recoil";

const ArticlePreview = (props) => {
    const { author, title, description, favoritesCount, favorited, createdAt, tagList, slug } = props.data;

    const [disabled, setDisabled] = useState(false);

    const userLogin = useRecoilValue(userInfo);

    const handleCreatedDate = (createdAt) => {
        const date = new Date(createdAt);
        const month = date.toLocaleString("en-US", {
            month: "long",
        });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day},${year}`;
    };

    const navigate = useNavigate();
    const handleOnClick = () => {
        navigate(`/article/${slug}`);
    };

    const goToProfilePage = (e) => {
        e.preventDefault();
        navigate(`/@${author.username}`);
    };

    const [likeCount, setLikeCount] = useState(favoritesCount);
    const [liked, setLiked] = useState(favorited);
    const handleLikeArticle = () => {
        if (!userLogin) {
            navigate("/login");
            return;
        }
        if (!liked) {
            try {
                setDisabled(true);
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
                    setDisabled(false);
                    setLikeCount(likeCount + 1);
                    setLiked(!liked);
                };
                likeArticle();
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                setDisabled(true);
                const unlikeArticle = async () => {
                    await axiosClient.delete(`/api/articles/${slug}/favorite`, {
                        headers: {
                            accept: "application/json",
                            authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                        },
                    });
                    setDisabled(false);
                    setLikeCount(likeCount - 1);
                    setLiked(!liked);
                };
                unlikeArticle();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className='article-preview'>
            <div className='article-meta'>
                <a href='' onClick={goToProfilePage}>
                    <img src={author.image} />
                </a>
                <div className='info'>
                    <a href='' className='author' onClick={goToProfilePage}>
                        {author.username}
                    </a>
                    <span className='date'>{handleCreatedDate(createdAt)}</span>
                </div>
                <button
                    className={`btn btn-outline-primary btn-sm pull-xs-right ${liked ? "active" : ""} ${disabled ? "disabled" : ""}`}
                    onClick={handleLikeArticle}
                >
                    <i className='ion-heart'></i> {likeCount}
                </button>
            </div>
            <div className='preview-link' onClick={handleOnClick} style={{ cursor: "pointer" }}>
                <h1>{title}</h1>
                <p>{description}</p>
                <div className='readmore_and_tags'>
                    <span>Read more...</span>
                    <div className='tags'>
                        {tagList.map((name, index) => (
                            <Tag key={index} name={name} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlePreview;
