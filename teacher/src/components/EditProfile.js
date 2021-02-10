import React, { Component } from 'react';

//TODO API
import { getDataTeacher, database } from "../api/Database";
import { CREATE_SALT, HMAC_SHA256 } from "../api/Authentication";

//TODO SCSS
import "../scss/EditProfile.scss";

class EditProfile extends Component {
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

    handleChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const SALT = CREATE_SALT(10);

        if(name === "password") {
            const HASH = HMAC_SHA256(value, SALT);
            this.setState({
                teacher: {...this.state.teacher, salt: SALT, hash: HASH}
            });
        } else {
            this.setState({
                teacher: {...this.state.teacher, [name]: value}
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let teacherKey;
        database.ref("teacher").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().teacherid === this.state.teacher.teacherid) {
                    teacherKey = element.key
                }
            })
        })
        database.ref("teacher").child(teacherKey).set(this.state.teacher);
        alert("Lưu thông tin thành công.");
        this.props.changeStatus("PROFILE");
    }

    renderEditProfile() {
        if(this.state.teacher) {
            return (
                <div className="edit_profile">
                    <h1>Sửa thông tin cá nhân</h1>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <div>
                            <label>Tài khoản</label>
                            <input type="text" name="username" defaultValue={this.state.teacher.username} disabled/>
                        </div>
                        <div>
                            <label>Mật khẩu</label>
                            <input type="password" name="password" onChange={(e) => this.handleChange(e)} autoComplete="off" required/>
                        </div>
                        <div>
                            <label>Họ và tên</label>
                            <input type="text" name="name" defaultValue={this.state.teacher.name} onChange={(e) => this.handleChange(e)} autoComplete="off" required/>
                        </div>
                        <div>
                            <label>Giới tính</label>
                            <select name="gender" defaultValue={this.state.teacher.gender} onChange={(e) => this.handleChange(e)} autoComplete="off" required>
                                <option value={0}>Nam</option>
                                <option value={1}>Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label>Ngày sinh</label>
                            <input type="date" name="dateofbirth" defaultValue={this.state.teacher.dateofbirth} onChange={(e) => this.handleChange(e)} autoComplete="off" required/>
                        </div>
                        <div>
                            <label>Số điện thoại</label>
                            <input type="number" name="phone" defaultValue={this.state.teacher.phone} onChange={(e) => this.handleChange(e)} autoComplete="off" required/>
                        </div>
                        <button type="submit">Lưu</button>
                    </form>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="container">
                {this.renderEditProfile()}
            </div>
        );
    }
}

export default EditProfile;