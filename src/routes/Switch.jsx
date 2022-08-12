import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Article from "../pages/Article";
import ArticleForm from "../pages/ArticleForm";

const Switch = () => {
    return (
        <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/login' element={<Auth />} />
            <Route path='/register' element={<Auth />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/editor/:slug' element={<ArticleForm />} />
            <Route path='/editor' element={<ArticleForm />} />
            <Route path='/article/:slug' element={<Article />} />
            <Route path='/:username' element={<Profile />} />
            <Route path='/:username/favorites' element={<Profile />} />
        </Routes>
    );
};

export default Switch;
