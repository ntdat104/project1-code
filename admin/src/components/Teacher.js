import React, { Component } from 'react';

//TODO API
import { getDataTeacher, database } from "../api/Database";
import { CREATE_SALT, HMAC_SHA256 } from "../api/Authentication";

//TODO SCSS
import "../scss/Teacher.scss";

class Teacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addStatus: false,
            addTeacher: {},
            editStatus: false
        };
    }

    async getData() {
        let Teachers = await getDataTeacher();

        Teachers = Teachers.sort((a, b) => {
            if(a.teacherid > b.teacherid) return 1;
            if(a.teacherid < b.teacherid) return -1;
            return 0;
        });
        
        this.setState({
            teachers: Teachers
        });
    }

    componentDidMount() {
        this.getData();
    }

    handleAddChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const SALT = CREATE_SALT(10);

        if(name === "teacherid" || name === "username") {
            value = value.toLowerCase();
        }

        if(name === "password") {
            const HASH = HMAC_SHA256(value, SALT);
            this.setState({
                addTeacher: {...this.state.addTeacher, salt: SALT, hash: HASH}
            })
        } else {
            this.setState({
                addTeacher: {...this.state.addTeacher, [name]: value}
            })
        }
    }

    handleAddSubmit(e) {
        e.preventDefault();
        let result;
        database.ref("teacher").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().teacherid === this.state.addTeacher.teacherid) {
                    result = element.val();
                }
            })
        });
        if(result) {
            alert("ID đã tồn tại.")
        } else {
            database.ref("teacher").push(this.state.addTeacher);
            this.setState({ addStatus: false });
            this.getData();
        }
    }

    checkAddStatus() {
        if(this.state.addStatus) {
            return (
                <form onSubmit={(e) => this.handleAddSubmit(e)}>
                    <input type="text" name="teacherid" placeholder="ID" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="username" placeholder="Tài khoản" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="password" placeholder="Mật khẩu" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="name" placeholder="Họ và tên" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <select name="gender" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required>
                        <option value="">Chọn giới tính</option>
                        <option value={0}>Nam</option>
                        <option value={1}>Nữ</option>
                    </select>
                    <input type="date" name="dateofbirth" placeholder="Ngày sinh" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="phone" placeholder="Số điện thoại" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <button type="submit">Thêm</button>
                </form>
            )
        }
    }

    handleEditChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const SALT = CREATE_SALT(10);

        if(name === "teacherid" || name === "username") {
            value = value.toLowerCase();
        }

        if(name === "password") {
            const HASH = HMAC_SHA256(value, SALT);
            this.setState({
                editTeacher: {...this.state.editTeacher, salt: SALT, hash: HASH}
            })
        } else {
            this.setState({
                editTeacher: {...this.state.editTeacher, [name]: value}
            })
        }
    }

    handleEditSubmit(e) {
        e.preventDefault();
        let key;
        database.ref("teacher").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().teacherid === this.state.editTeacher.teacherid) {
                    key = element.key
                }
            })
        });
        database.ref("teacher").child(key).set(this.state.editTeacher);
        this.setState({ editStatus: false });
        this.getData()
    }

    checkEditStatus() {
        if(this.state.editStatus) {
            return (
                <form onSubmit={(e) => this.handleEditSubmit(e)}>
                    <input type="text" defaultValue={this.state.editTeacher.teacherid} name="teacherid" placeholder="ID" onChange={(e) => this.handleEditChange(e)} autoComplete="off" disabled/>
                    <input type="text" defaultValue={this.state.editTeacher.username} name="username" placeholder="Tài khoản" onChange={(e) => this.handleEditChange(e)} autoComplete="off" disabled/>
                    <input type="text" name="password" placeholder="Mật khẩu" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <input type="text" defaultValue={this.state.editTeacher.name} name="name" placeholder="Họ và tên" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <select name="gender" defaultValue={this.state.editTeacher.gender} onChange={(e) => this.handleEditChange(e)} autoComplete="off" required>
                        <option value={0}>Nam</option>
                        <option value={1}>Nữ</option>
                    </select>
                    <input type="date" defaultValue={this.state.editTeacher.dateofbirth} name="dateofbirth" placeholder="Ngày sinh" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <input type="text" defaultValue={this.state.editTeacher.phone} name="phone" placeholder="Số điện thoại" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <button type="submit">Lưu</button>
                </form>
            )
        }
    }

    editTeacher(element) {
        if(this.state.editStatus) {
            alert("Bạn phải lưu trước khi sửa.")
        } else {
            this.setState({
                editTeacher: element,
                editStatus: true
            });
        }
    }

    removeTeacher(element) {
        let key;
        database.ref("teacher").on("value", (snapshot) => {
            snapshot.forEach((ele) => {
                if(ele.val().teacherid === element.teacherid) {
                    key = ele.key
                }
            })
        })
        database.ref("teacher").child(key).remove();
        this.getData();
    }

    mapClass() {
        return this.state.teachers.map((element, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{element.teacherid}</td>
                <td>{element.username}</td>
                <td>{element.name}</td>
                <td>{parseInt(element.gender) ? "Nữ" : "Nam"}</td>
                <td>{element.dateofbirth}</td>
                <td>{element.phone}</td>
                <td>
                    <button onClick={() => this.editTeacher(element)}>Sửa</button>
                    <button onClick={() => this.removeTeacher(element)}>Xóa</button>
                </td>
            </tr>
        ))
    }

    renderTeacher() {
        if(this.state.teachers) {
            return (
                <div className="teacher">
                    <h1>Danh sách giáo viên</h1>
                    {this.checkAddStatus()}
                    {this.checkEditStatus()}
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>ID</th>
                                <th>Tài khoản</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Số điện thoại</th>
                                <th>
                                    <button onClick={() => this.setState({ addStatus: !this.state.addStatus })}>Thêm</button>
                                </th>
                            </tr>
                            {this.mapClass()}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="container">
                {this.renderTeacher()}
            </div>
        );
    }
}

export default Teacher;