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
    constructor(props: any) {
        super(props);
    }
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

// This function will convert state-store values to
// component properties
const mapStateToProps = (state: IState) => {
    return {
        user: state.user
    }
}

// This object definition will be used to map action creators to
// properties
const mapDispatchToProps = {
    updateUserSession: updateUserSession
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);