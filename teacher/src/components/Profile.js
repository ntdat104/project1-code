import React, { Component } from 'react';

//TODO API
import { getDataTeacher } from "../api/Database";

//TODO SCSS
import "../scss/Profile.scss";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async getData() {
        const DataTeacher = await getDataTeacher();
        const teacher = DataTeacher.filter((teacher) => teacher.teacherid === this.props.teacherid)[0];
        this.setState({ teacher: teacher });
    }
    
    componentDidMount() {
        this.getData();
    }

    renderProfile() {
        if(this.state.teacher) {
            return (
                <div className="profile">
                    <h1>Thông tin cá nhân</h1>
                    <div className="btn">
                        <button onClick={() => this.props.changeStatus("EDIT_PROFILE")}>Sửa thông tin</button>
                        <button onClick={() => this.props.signOut()}>Đăng xuất</button>
                    </div>
                    <ul>
                        <li>
                            <h2>Tài khoản</h2>
                            <p>{this.state.teacher.username}</p>
                        </li>
                        <li>
                            <h2>Họ và tên</h2>
                            <p>{this.state.teacher.name}</p>
                        </li>
                        <li>
                            <h2>Giới tính</h2>
                            <p>{parseInt(this.state.teacher.gender) ? "Nữ" : "Nam"}</p>
                        </li>
                        <li>
                            <h2>Ngày sinh</h2>
                            <p>{this.state.teacher.dateofbirth}</p>
                        </li>
                        <li>
                            <h2>Số điện thoại</h2>
                            <p>{this.state.teacher.phone}</p>
                        </li>
                    </ul>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="container">
                {this.renderProfile()}
            </div>
        );
    }
}

export default Profile;