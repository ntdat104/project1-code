import React, { Component } from 'react';

//TODO API
import { getDataClass, getDataCourse, database } from "../api/Database";

//TODO SCSS
import "../scss/ClassList.scss";

class ClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addStatus: false,
            addClass: {},
            editStatus: false,
        };
    }
    
    async getClass() {
        const Classes = await getDataClass();
        const Courses = await getDataCourse();
        let classes = [];
        Classes.forEach((element) => {
            Courses.forEach((elementCourse) => {
                if(element.courseid === elementCourse.courseid) {
                    const Class = {
                        classid: element.classid,
                        courseid: element.courseid,
                        teacherid: element.teacherid,
                        coursename: elementCourse.name
                    }
                    classes.push(Class);
                }
            })
        });

        classes = classes.sort((a, b) => {
            if(a.classid > b.classid) return 1;
            if(a.classid < b.classid) return -1;
            return 0;
        });

        this.setState({ classes: classes });
    }
    
    componentDidMount() {
        this.getClass();
    }

    handleAddChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(name === "classid" || name === "courseid") {
            value = value.toUpperCase();
        }

        this.setState({
            addClass: {...this.state.addClass, [name]: value}
        })
    }

    handleAddSubmit(e) {
        e.preventDefault();
        const result = this.state.classes.filter((element) => element.classid === this.state.addClass.classid)[0];
        if(result) {
            alert("Mã lớp đã tồn tại.")
        } else {
            const ClassElement = {
                classid: this.state.addClass.classid,
                courseid: this.state.addClass.courseid,
                teacherid: this.state.addClass.teacherid
            };
            database.ref("class").push(ClassElement);
            this.setState({addStatus: false});
            this.getClass();
        }
    }

    checkAddStatus() {
        if(this.state.addStatus) {
            return (
                <form onSubmit={(e) => this.handleAddSubmit(e)}>
                    <input type="text" name="classid" placeholder="Mã lớp" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="courseid" placeholder="Mã khóa học" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="teacherid" placeholder="Mã giáo viên" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <button type="submit">Thêm</button>
                </form>
            )
        }
    }

    handleEditChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(name === "classid" || name === "courseid") {
            value = value.toUpperCase();
        }

        this.setState({
            editClass: {...this.state.editClass, [name]: value}
        })
    }

    handleEditSubmit(e) {
        e.preventDefault();
        let key;
        database.ref("class").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().classid === this.state.editClass.classid) {
                    key = element.key
                }
            })
        })
        const result = {
            classid: this.state.editClass.classid,
            courseid: this.state.editClass.courseid,
            teacherid: this.state.editClass.teacherid.toLowerCase()
        }
        database.ref("class").child(key).set(result);
        this.setState({ editStatus: false });
        this.getClass();
    }

    checkEditStatus() {
        if(this.state.editStatus) {
            return (
                <form onSubmit={(e) => this.handleEditSubmit(e)}>
                    <input type="text" defaultValue={this.state.editClass.classid} name="classid" placeholder="Mã lớp" onChange={(e) => this.handleEditChange(e)} autoComplete="off" disabled/>
                    <input type="text" defaultValue={this.state.editClass.courseid} name="courseid" placeholder="Mã khóa học" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <input type="text" defaultValue={this.state.editClass.teacherid} name="teacherid" placeholder="Mã giáo viên" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <button type="submit">Lưu</button>
                </form>
            )
        }
    }

    editClass(element) {
        if(this.state.editStatus) {
            alert("Bạn phải lưu trước khi sửa.")
        } else {
            this.setState({
                editClass: element,
                editStatus: true
            });
        }
    }

    removeClass(element) {
        let keyClass;
        database.ref("class").on("value", (snapshot) => {
            snapshot.forEach((ele) => {
                if(ele.val().classid === element.classid) {
                    keyClass = ele.key
                }
            })
        })
        database.ref("class").child(keyClass).remove();
        this.getClass();
    }

    mapClass() {
        return this.state.classes.map((element, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{element.classid}</td>
                <td>{element.courseid}</td>
                <td>{element.coursename}</td>
                <td>{element.teacherid}</td>
                <td>
                    <button onClick={() => this.props.changeStatus("CLASS_INFO", element.classid)}>Xem</button>
                    <button onClick={() => this.editClass(element)}>Sửa</button>
                    <button onClick={() => this.removeClass(element)}>Xóa</button>
                </td>
            </tr>
        ))
    }

    renderClassList() {
        if(this.state.classes) {
            return (
                <div className="class_list">
                    <h1>Danh sách lớp</h1>
                    {this.checkAddStatus()}
                    {this.checkEditStatus()}
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã lớp</th>
                                <th>Mã khóa học</th>
                                <th>Tên khóa học</th>
                                <th>Mã giáo viên</th>
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
                {this.renderClassList()}
            </div>
        );
    }
}

export default ClassList;