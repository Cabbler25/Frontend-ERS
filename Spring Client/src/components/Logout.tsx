import React from 'react';
import { Redirect } from "react-router";
import { IUserState, IState } from '../utils';
import { logout } from '../utils/actions';
import { connect } from 'react-redux';

interface ILogoutProps {
    user: IUserState,
    logout: () => void
}

class Logout extends React.Component<ILogoutProps, any> {
    render() {
        this.props.logout();
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
    logout: logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
