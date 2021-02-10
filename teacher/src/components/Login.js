import React, { Component } from 'react';

//TODO SCSS
import "../scss/Login.scss";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const account = {
            username: this.state.username.toLowerCase(),
            password: this.state.password
        }
        this.props.checkAccount(account)
    }
    
    render() {
        return (
            <div className="login">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <h1>GIÁO VIÊN</h1>
                    <div>
                        <label htmlFor="login_username">TÀI KHOẢN</label>
                        <input name="username" id="login_username" onChange={(e) => this.handleChange(e)} type="text" autoComplete="Off" required/>
                    </div>
                    <div>
                        <label htmlFor="login_password">MẬT KHẨU</label>
                        <input name="password" id="login_password" onChange={(e) => this.handleChange(e)} type="password" autoComplete="Off" required/>
                    </div>
                    <p onClick={() => alert("Chưa phát triển.")}>Quên mật khẩu?</p>
                    <button type="submit">ĐĂNG NHẬP</button>
                </form>
            </div>
        );
    }
}

export default Login;