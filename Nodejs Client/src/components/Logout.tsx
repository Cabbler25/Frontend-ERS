import React from 'react';
import { Redirect } from "react-router";
import { IUserState, IState } from '../utils';
import { updateUserSession } from '../utils/actions';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

interface ILogoutProps {
    user: IUserState,
    updateUserSession: (val: boolean, n: string) => void
}

class Logout extends React.Component<ILogoutProps, any> {
    render() {
        Cookies.remove('user');
        Cookies.remove('permissions');
        this.props.updateUserSession(false, '');
        return (
            <div>
                <Redirect to="/login" />
            </div >
        );
    }
}

const mapStateToProps = (state: IState) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {
    updateUserSession: updateUserSession
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);