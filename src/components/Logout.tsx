import React from 'react';
import { Redirect } from "react-router";

const Logout: React.FC = () => {
    return (
        <div>
            <Redirect to="/login" />
        </div>
    );
}

export default Logout;