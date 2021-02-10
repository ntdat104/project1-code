import React, { Component } from 'react';

//TODO API
import { getDataStudent, database } from "../api/Database";
import { CREATE_SALT, HMAC_SHA256 } from "../api/Authentication";

//TODO SCSS
import "../scss/Student.scss";

class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addStatus: false,
            addStudent: {},
            editStatus: false
        };
    }

    async getData() {
        let Students = await getDataStudent();

        Students = Students.sort((a, b) => {
            if(a.studentid > b.studentid) return 1;
            if(a.studentid < b.studentid) return -1;
            return 0;
        });

        this.setState({
            students: Students
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

        if(name === "studentid" || name === "username") {
            value = value.toLowerCase();
        }

        if(name === "password") {
            const HASH = HMAC_SHA256(value, SALT);
            this.setState({
                addStudent: {...this.state.addStudent, salt: SALT, hash: HASH}
            })
        } else {
            this.setState({
                addStudent: {...this.state.addStudent, [name]: value}
            })
        }
    }

    handleAddSubmit(e) {
        e.preventDefault();
        let result;
        database.ref("student").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().studentid === this.state.addStudent.studentid) {
                    result = element.val();
                }
            })
        });
        if(result) {
            alert("ID đã tồn tại.")
        } else {
            database.ref("student").push(this.state.addStudent);
            this.setState({ addStatus: false });
            this.getData();
        }
    }

    checkAddStatus() {
        if(this.state.addStatus) {
            return (
                <form onSubmit={(e) => this.handleAddSubmit(e)}>
                    <input type="text" name="studentid" placeholder="ID" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
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

        if(name === "studentid" || name === "username") {
            value = value.toLowerCase();
        }

        if(name === "password") {
            const HASH = HMAC_SHA256(value, SALT);
            this.setState({
                editStudent: {...this.state.editStudent, salt: SALT, hash: HASH}
            })
        } else {
            this.setState({
                editStudent: {...this.state.editStudent, [name]: value}
            })
        }
    }

    handleEditSubmit(e) {
        e.preventDefault();
        let key;
        database.ref("student").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().studentid === this.state.editStudent.studentid) {
                    key = element.key
                }
            })
        });
        database.ref("student").child(key).set(this.state.editStudent);
        this.setState({ editStatus: false });
        this.getData()
    }

    checkEditStatus() {
        if(this.state.editStatus) {
            return (
                <form onSubmit={(e) => this.handleEditSubmit(e)}>
                    <input type="text" defaultValue={this.state.editStudent.studentid} name="studentid" placeholder="ID" onChange={(e) => this.handleEditChange(e)} autoComplete="off" disabled/>
                    <input type="text" defaultValue={this.state.editStudent.username} name="username" placeholder="Tài khoản" onChange={(e) => this.handleEditChange(e)} autoComplete="off" disabled/>
                    <input type="text" name="password" placeholder="Mật khẩu" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <input type="text" defaultValue={this.state.editStudent.name} name="name" placeholder="Họ và tên" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <select name="gender" defaultValue={this.state.editStudent.gender} onChange={(e) => this.handleEditChange(e)} autoComplete="off" required>
                        <option value={0}>Nam</option>
                        <option value={1}>Nữ</option>
                    </select>
                    <input type="date" defaultValue={this.state.editStudent.dateofbirth} name="dateofbirth" placeholder="Ngày sinh" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <input type="text" defaultValue={this.state.editStudent.phone} name="phone" placeholder="Số điện thoại" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <button type="submit">Lưu</button>
                </form>
            )
        }
    }

    editStudent(element) {
        if(this.state.editStatus) {
            alert("Bạn phải lưu trước khi sửa.")
        } else {
            this.setState({
                editStudent: element,
                editStatus: true
            });
        }
    }

    removeStudent(element) {
        let key;
        database.ref("student").on("value", (snapshot) => {
            snapshot.forEach((ele) => {
                if(ele.val().studentid === element.studentid) {
                    key = ele.key
                }
            })
        })
        database.ref("student").child(key).remove();
        this.getData();
    }

    mapClass() {
        return this.state.students.map((element, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{element.studentid}</td>
                <td>{element.username}</td>
                <td>{element.name}</td>
                <td>{parseInt(element.gender) ? "Nữ" : "Nam"}</td>
                <td>{element.dateofbirth}</td>
                <td>{element.phone}</td>
                <td>
                    <button onClick={() => this.editStudent(element)}>Sửa</button>
                    <button onClick={() => this.removeStudent(element)}>Xóa</button>
                </td>
            </tr>
        ))
    }

    renderStudent() {
        if(this.state.students) {
            return (
                <div className="student">
                    <h1>Danh sách học sinh</h1>
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
                {this.renderStudent()}
            </div>
        );
    }
}

export default Student;