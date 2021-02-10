import React, { Component } from 'react';

//TODO API
import { getDataAdmin } from "./api/Database";
import { HMAC_SHA256 } from "./api/Authentication";

//TODO COMPONENTS
import Admin from './components/Admin';
import Login from './components/Login';

//TODO SCSS
import "./App.scss";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async checkAccount(account) {
        const admin = await getDataAdmin();
        if(admin.username === account.username && HMAC_SHA256(account.password, admin.salt) === admin.hash) {
            alert("Đăng nhập thành công.");
            this.setState({
                admin: <Admin />
            });
        } else alert("Sai mật khẩu hoặc tài khoản không tồn tại.")
    }

    checkLogin() {
        if(this.state.admin) {
            return this.state.admin
        }
        return <Login checkAccount={(account) => this.checkAccount(account)}/>
    }
    
    render() {
        return (
            <div>
                {this.checkLogin()}
            </div>
        );
    }
}

export default App;