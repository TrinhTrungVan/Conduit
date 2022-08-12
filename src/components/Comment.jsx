import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { userInfo } from "../recoil";

const Comment = (props) => {
    const { data } = props;
    const userLogin = useRecoilValue(userInfo);

    const { pathname } = useLocation();
    const slug = pathname.split("/")[2];

    const handleCreatedDate = (createdAt) => {
        const date = new Date(createdAt);
        const month = date.toLocaleString("en-US", {
            month: "long",
        });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day},${year}`;
    };

    const handleDeleteComment = () => {
        props.deleteComment(slug, data.id);
    };

    const navigate = useNavigate();
    const goToProfilePage = () => {
        navigate(`/@${data.author.username}`);
    };

    return (
        <div className='card'>
            <div className='card-block'>
                <p className='card-text'>{data.body}</p>
            </div>
            <div className='card-footer'>
                <div className='comment-author' style={{ cursor: "pointer" }} onClick={goToProfilePage}>
                    <img src={data.author.image} className='comment-author-img' />
                    &nbsp;
                    {data.author.username}
                </div>
                <span className='date-posted'>{handleCreatedDate(data.createdAt)}</span>
                {userLogin && userLogin.username === data.author.username && (
                    <span className='mod-options'>
                        {/* <i className='ion-edit'></i> */}
                        <i className='ion-trash-a' onClick={handleDeleteComment}></i>
                    </span>
                )}
            </div>
        </div>
    );
};

export default Comment;
