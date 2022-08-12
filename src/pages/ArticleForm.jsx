import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { userInfo } from "../recoil";

import axiosClient from "../api/axiosClient";

const ArticleForm = () => {
    const userLogin = useRecoilValue(userInfo);

    // Handle edit article
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const slug = pathname.split("/")[2] ? pathname.split("/")[2] : null;

    const [inputTitle, setInputTitle] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [inputBody, setInputBody] = useState("");
    const [inputTagName, setInputTagName] = useState("");
    const [tags, setTags] = useState([]);

    const [errorMessage, setErrorMessage] = useState(null);

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (slug) {
            try {
                const getArticle = async () => {
                    const res = await axiosClient.get(`/api/articles/${slug}`);
                    setInputTitle(res.article.title);
                    setInputDescription(res.article.description);
                    setInputBody(res.article.body);
                    setTags(res.article.tagList);
                };
                getArticle();
            } catch (error) {
                throw error;
            }
        }
    }, []);

    const handleChangeInputTitle = (e) => {
        setInputTitle(e.target.value);
    };
    const handleChangeInputDescription = (e) => {
        setInputDescription(e.target.value);
    };
    const handleChangeInputBody = (e) => {
        setInputBody(e.target.value);
    };
    const handleChangeInputTagName = (e) => {
        setInputTagName(e.target.value);
    };

    const handleOnKeyPress = (e) => {
        if (e.code === "Enter") {
            setTags([...tags, inputTagName]);
            setInputTagName("");
        }
    };
    const handleDeleteTag = (e) => {
        const deleteIndex = +e.target.parentNode.dataset.index;
        const newTags = [...tags.slice(0, deleteIndex), ...tags.slice(deleteIndex + 1)];
        setTags(newTags);
    };

    const handlePostArticle = () => {
        setDisabled(true);
        if (slug) {
            const postArticle = async () => {
                try {
                    const res = await axiosClient.put(
                        `/api/articles/${slug}`,
                        {
                            article: {
                                title: inputTitle,
                                description: inputDescription,
                                body: inputBody,
                                tagList: tags,
                            },
                        },
                        {
                            headers: {
                                accept: "application/json",
                                authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                            },
                        }
                    );
                    setDisabled(false);
                    navigate(`/article/${res.article.slug}`);
                } catch (error) {
                    setErrorMessage(error.response.data.errors.title[0]);
                }
            };
            postArticle();
        } else {
            const postArticle = async () => {
                try {
                    const res = await axiosClient.post(
                        "/api/articles",
                        {
                            article: {
                                title: inputTitle,
                                description: inputDescription,
                                body: inputBody,
                                tagList: tags,
                            },
                        },
                        {
                            headers: {
                                accept: "application/json",
                                authorization: `Token ${userLogin.token ? userLogin.token : ""}`,
                            },
                        }
                    );
                    setDisabled(false);
                    navigate(`/article/${res.article.slug}`);
                } catch (error) {
                    setErrorMessage(error.response.data.errors.title[0]);
                }
            };
            postArticle();
        }
    };

    return (
        <div className='editor-page'>
            <div className='container page'>
                <div className='row'>
                    <div className='col-md-10 offset-md-1 col-xs-12'>
                        {errorMessage && (
                            <ul className='error-messages'>
                                <li>{errorMessage}</li>
                            </ul>
                        )}

                        <form>
                            <fieldset>
                                <fieldset className='form-group'>
                                    <input
                                        type='text'
                                        className='form-control form-control-lg'
                                        disabled={disabled}
                                        placeholder='Article Title'
                                        value={inputTitle}
                                        onChange={handleChangeInputTitle}
                                    />
                                </fieldset>
                                <fieldset className='form-group'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        disabled={disabled}
                                        placeholder="What's this article about?"
                                        value={inputDescription}
                                        onChange={handleChangeInputDescription}
                                    />
                                </fieldset>
                                <fieldset className='form-group'>
                                    <textarea
                                        className='form-control'
                                        rows='8'
                                        disabled={disabled}
                                        placeholder='Write your article (in markdown)'
                                        value={inputBody}
                                        onChange={handleChangeInputBody}
                                    ></textarea>
                                </fieldset>
                                <fieldset className='form-group'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        disabled={disabled}
                                        placeholder='Enter tags'
                                        value={inputTagName}
                                        onChange={handleChangeInputTagName}
                                        onKeyPress={handleOnKeyPress}
                                    />
                                    <div className='tag-list'>
                                        {tags.map((nameTag, index) => (
                                            <div className='tag-default tag-pill ng-binding ng-scope' key={index} data-index={index}>
                                                <i className='ion-close-round' onClick={handleDeleteTag}></i>
                                                {nameTag}
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                                <button
                                    className={`btn btn-lg pull-xs-right btn-primary ${disabled ? "disabled" : ""}`}
                                    type='button'
                                    onClick={handlePostArticle}
                                >
                                    Publish Article
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleForm;
