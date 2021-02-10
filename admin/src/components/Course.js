import React, { Component } from 'react';

//TODO API
import { getDataCourse, database } from "../api/Database";

import "../scss/Course.scss";

class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addStatus: false,
            addCourse: {},
            editStatus: false
        };
    }

    async getData() {
        let Courses = await getDataCourse();

        Courses = Courses.sort((a, b) => {
            if(a.courseid > b.courseid) return 1;
            if(a.courseid < b.courseid) return -1;
            return 0;
        });

        this.setState({
            courses: Courses
        });
    }

    componentDidMount() {
        this.getData();
    }

    handleAddChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(name === "courseid") {
            value = value.toUpperCase();
        }

        this.setState({
            addCourse: {...this.state.addCourse, [name]: value}
        })
    }

    handleAddSubmit(e) {
        e.preventDefault();
        let result;
        database.ref("course").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().courseid === this.state.addCourse.courseid) {
                    result = element.val();
                }
            })
        });
        if(result) {
            alert("Mã khóa học đã tồn tại.")
        } else {
            database.ref("course").push(this.state.addCourse);
            this.setState({ addStatus: false });
            this.getData();
        }
    }

    checkAddStatus() {
        if(this.state.addStatus) {
            return (
                <form onSubmit={(e) => this.handleAddSubmit(e)}>
                    <input type="text" name="courseid" placeholder="Mã khóa học" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="name" placeholder="Tên khóa học" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <button type="submit">Thêm</button>
                </form>
            )
        }
    }

    handleEditChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(name === "courseid") {
            value = value.toUpperCase();
        }

        this.setState({
            editCourse: {...this.state.editCourse, [name]: value}
        })
    }

    handleEditSubmit(e) {
        e.preventDefault();
        let key;
        database.ref("course").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().courseid === this.state.editCourse.courseid) {
                    key = element.key
                }
            })
        });
        database.ref("course").child(key).set(this.state.editCourse);
        this.setState({ editStatus: false });
        this.getData()
    }

    checkEditStatus() {
        if(this.state.editStatus) {
            return (
                <form onSubmit={(e) => this.handleEditSubmit(e)}>
                    <input type="text" defaultValue={this.state.editCourse.courseid} name="courseid" placeholder="Mã khóa học" onChange={(e) => this.handleEditChange(e)} autoComplete="off" disabled/>
                    <input type="text" defaultValue={this.state.editCourse.name} name="name" placeholder="Tên khóa học" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <button type="submit">Lưu</button>
                </form>
            )
        }
    }

    editCourse(element) {
        if(this.state.editStatus) {
            alert("Bạn phải lưu trước khi sửa.")
        } else {
            this.setState({
                editCourse: element,
                editStatus: true
            });
        }
    }

    removeCourse(element) {
        let key;
        database.ref("course").on("value", (snapshot) => {
            snapshot.forEach((ele) => {
                if(ele.val().courseid === element.courseid) {
                    key = ele.key
                }
            })
        })
        database.ref("course").child(key).remove();
        this.getData();
    }

    mapCourse() {
        return this.state.courses.map((element, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{element.courseid}</td>
                <td>{element.name}</td>
                <td>
                    <button onClick={() => this.editCourse(element)}>Sửa</button>
                    <button onClick={() => this.removeCourse(element)}>Xóa</button>
                </td>
            </tr>
        ))
    }

    renderCourse() {
        if(this.state.courses) {
            return (
                <div className="course">
                    <h1>Danh sách khóa học</h1>
                    {this.checkAddStatus()}
                    {this.checkEditStatus()}
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã khóa học</th>
                                <th>Tên khóa học</th>
                                <th>
                                    <button onClick={() => this.setState({ addStatus: !this.state.addStatus })}>Thêm</button>
                                </th>
                            </tr>
                            {this.mapCourse()}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="container">
                {this.renderCourse()}
            </div>
        );
    }
}

export default Course;