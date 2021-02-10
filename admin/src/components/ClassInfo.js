import React, { Component } from 'react';

//TODO API
import { getDataClassMember, getDataStudent, database } from "../api/Database";

//TODO SCSS
import "../scss/ClassInfo.scss";

class ClassInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addStatus: false,
            addStudent: {},
            editStatus: false,
        };
    }

    async getData() {
        const ClassMembers = await getDataClassMember();
        const Students = await getDataStudent();

        let students = [];

        const ClassMember = ClassMembers.filter((element) => element.classid === this.props.classid);
        ClassMember.forEach((element) => {
            Students.forEach((ele) => {
                if(element.classid === this.props.classid && element.studentid === ele.studentid) {
                    const student = {
                        studentid: element.studentid,
                        count: element.count,
                        score: element.score,
                        studentname: ele.name
                    }
                    students.push(student);
                }
            })
        })

        students = students.sort((a, b) => {
            if(a.studentid > b.studentid) return 1;
            if(a.studentid < b.studentid) return -1;
            return 0;
        });

        this.setState({ students: students });
    }

    componentDidMount() {
        this.getData();
    }

    handleAddChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(name === "studentid") {
            value = value.toLowerCase();
        }

        this.setState({
            addStudent: {...this.state.addStudent, [name]: value}
        })
    }

    handleAddSubmit(e) {
        e.preventDefault();
        const result = this.state.students.filter((element) => element.studentid === this.state.addStudent.studentid)[0];
        if(result) {
            alert("Mã lớp đã tồn tại.")
        } else {
            const classMember = {
                classid: this.props.classid,
                studentid: this.state.addStudent.studentid,
                count: this.state.addStudent.count,
                score: this.state.addStudent.score
            }
            database.ref("class_member").push(classMember);
            this.setState({ addStatus: false });
            this.getData();
        }
    }

    checkAddStatus() {
        if(this.state.addStatus) {
            return (
                <form onSubmit={(e) => this.handleAddSubmit(e)}>
                    <input type="text" name="studentid" placeholder="Mã học sinh" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="count" placeholder="Số buổi học" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <input type="text" name="score" placeholder="Điểm" onChange={(e) => this.handleAddChange(e)} autoComplete="off" required/>
                    <button type="submit">Thêm</button>
                </form>
            )
        }
    }

    handleEditChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(name === "studentid") {
            value = value.toLowerCase();
        }

        this.setState({
            editStudent: {...this.state.editStudent, [name]: value}
        })
    }

    handleEditSubmit(e) {
        e.preventDefault();
        let key;
        database.ref("class_member").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().classid === this.props.classid && element.val().studentid === this.state.editStudent.studentid) {
                    key = element.key
                }
            })
        })
        const result = {
            classid: this.props.classid,
            studentid: this.state.editStudent.studentid,
            count: this.state.editStudent.count,
            score: this.state.editStudent.score
        }
        database.ref("class_member").child(key).set(result);
        this.setState({ editStatus: false });
        this.getData();
    }

    checkEditStatus() {
        if(this.state.editStatus) {
            return (
                <form onSubmit={(e) => this.handleEditSubmit(e)}>
                    <input type="text" defaultValue={this.state.editStudent.studentid} name="studentid" placeholder="Mã học sinh" onChange={(e) => this.handleEditChange(e)} autoComplete="off" disabled/>
                    <input type="text" defaultValue={this.state.editStudent.count} name="count" placeholder="Số buổi học" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
                    <input type="text" defaultValue={this.state.editStudent.score} name="score" placeholder="Điểm" onChange={(e) => this.handleEditChange(e)} autoComplete="off" required/>
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
        database.ref("class_member").on("value", (snapshot) => {
            snapshot.forEach((ele) => {
                if(ele.val().studentid === element.studentid) {
                    key = ele.key
                }
            })
        })
        database.ref("class_member").child(key).remove();
        this.getData();
    }

    mapStudent() {
        return this.state.students.map((element, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{element.studentid}</td>
                <td>{element.studentname}</td>
                <td>{element.count}</td>
                <td>{element.score}</td>
                <td>
                    <button onClick={() => this.editStudent(element)}>Sửa</button>
                    <button onClick={() => this.removeStudent(element)}>Xóa</button>
                </td>
            </tr>
        ))
    }

    renderClassInfo() {
        if(this.state.students) {
            return (
                <div className="class_info">
                    <h1>Học sinh lớp {this.props.classid}</h1>
                    {this.checkAddStatus()}
                    {this.checkEditStatus()}
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã học sinh</th>
                                <th>Tên học sinh</th>
                                <th>Số buổi học</th>
                                <th>Điểm</th>
                                <th>
                                    <button onClick={() => this.setState({ addStatus: !this.state.addStatus })}>Thêm</button>
                                </th>
                            </tr>
                            {this.mapStudent()}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="container">
                {this.renderClassInfo()}
            </div>
        );
    }
}

export default ClassInfo;