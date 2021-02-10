import React, { Component } from 'react';

//TODO API
import { getDataTeacher } from "./api/Database";
import { HMAC_SHA256 } from "./api/Authentication";

//TODO COMPONENTS
import Login from './components/Login';
import Teacher from './components/Teacher';

//TODO SCSS
import "./App.scss";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const teacherid = JSON.parse(sessionStorage.getItem("teacherid"));
        if(teacherid) {
            this.setState({ teacherid: teacherid });
        }
    }

    async checkAccount(account) {
        const DataTeacher = await getDataTeacher();
        const teacher = DataTeacher.filter((teacher) => account.username === teacher.username && HMAC_SHA256(account.password, teacher.salt) === teacher.hash)[0];
        if(teacher) {
            alert("Đăng nhập thành công.");
            this.setState({
                teacherid: teacher.teacherid
            });
            sessionStorage.setItem("teacherid", JSON.stringify(teacher.teacherid));
        } else alert("Sai mật khẩu hoặc tài khoản không tồn tại.")
    }

    checkLogin() {
        if(this.state.teacherid) {
            return <Teacher
                        teacherid={this.state.teacherid}
                        signOut={() => this.signOut()}
                    />
        }
        return <Login checkAccount={(account) => this.checkAccount(account)}/>
    }

    signOut() {
        sessionStorage.clear();
        this.setState({ teacherid: null });
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