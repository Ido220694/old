import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';

const Header = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/" className="item"> Draw and Guess </Link>
            <div className="right menu">
                <Link to="/" className="item">Main</Link>
                <GoogleAuth/>
            </div>
        </div>
    );
};

export default Header;