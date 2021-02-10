import React, { Component } from 'react';

//TODO API
import { getDataClassMember, getDataClass, getDataCourse, getDataStudent, database } from "../api/Database";

//TODO SCSS
import "../scss/ClassInfo.scss";

class ClassInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async getData() {
        let classInfo = [];
        const DataClass = await getDataClass();
        const Class = DataClass.filter((element) => element.classid === this.props.classid)[0];

        const DataCourse = await getDataCourse();
        const Course = DataCourse.filter((element) => element.courseid === Class.courseid)[0];

        const Students = await getDataStudent();

        const DataClassMember = await getDataClassMember();
        const ClassMembers = DataClassMember.filter((element) => element.classid === this.props.classid);
        ClassMembers.forEach((classMemberElement) => {
            Students.forEach((studentElement) => {
                if(classMemberElement.studentid === studentElement.studentid) {
                    const element = {
                        studentId: studentElement.studentid,
                        studentName: studentElement.name,
                        studentGender: studentElement.gender,
                        studentDateOfBirth: studentElement.dateofbirth,
                        studentPhone: studentElement.phone,
                        studentCount: classMemberElement.count,
                        studentScore: classMemberElement.score,
                        studentCourseId: Course.courseid,
                        studentCourseName: Course.name
                    }
                    classInfo.push(element);
                }
            })
        })

        classInfo = classInfo.sort((a, b) => {
            if(a.studentId > b.studentId) return 1;
            if(a.studentId < b.studentId) return -1;
            return 0;
        });

        this.setState({ classInfo: classInfo });
    }
    
    componentDidMount() {
        this.getData();
    }

    mapClass() {
        if(this.state.classInfo) {
            return this.state.classInfo.map((element, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{element.studentId}</td>
                    <td>{element.studentName}</td>
                    <td>{parseInt(element.studentGender) ? "Nữ" : "Nam"}</td>
                    <td>{element.studentDateOfBirth}</td>
                    <td>{element.studentPhone}</td>
                    <td>{element.studentCount}</td>
                    <td>{element.studentScore}</td>
                    <td>{element.studentCourseId}</td>
                    <td>{element.studentCourseName}</td>
                    <td>
                        <button onClick={() => this.getStudentEdit(element)}>Sửa</button>
                    </td>
                </tr>
            ))
        }
    }

    renderClassInfo() {
        if(this.state.classInfo) {
            return (
                <div className="class_info">
                    <h1>Danh sách học sinh lớp {this.props.classid}</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã học sinh</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Số điện thoại</th>
                                <th>Số buổi học</th>
                                <th>Điểm</th>
                                <th>Mã khóa học</th>
                                <th>Tên khóa học</th>
                                <th>Chức năng</th>
                            </tr>
                            {this.mapClass()}
                        </tbody>
                    </table>
                    {this.renderEditForm()}
                </div>
            )
        }
    }

    getStudentEdit(student) {
        if(this.state.editStatus) {
            alert("Bạn phải lưu trước khi sửa tiếp.")
        } else this.setState({ student: student, editStatus: true });
    }

    handleChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        const student = {...this.state.student, [name]: value}

        this.setState({
            student: student
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let classMemberKey;
        database.ref("class_member").on("value", (snapshot) => {
            snapshot.forEach((element) => {
                if(element.val().classid === this.props.classid && element.val().studentid === this.state.student.studentId) {
                    classMemberKey = element.key
                }
            })
        })
        const student = {
            classid: this.props.classid,
            count: this.state.student.studentCount,
            score: this.state.student.studentScore,
            studentid: this.state.student.studentId
        }
        database.ref("class_member").child(classMemberKey).set(student);
        this.setState({ editStatus: false });
        this.getData();
    }

    renderEditForm() {
        if(this.state.student && this.state.editStatus) {
            return (
                <form className="edit_form" onSubmit={(e) => this.handleSubmit(e)}>
                    <div>
                        <input type="text" defaultValue={this.state.student.studentId} disabled/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.state.student.studentName} disabled/>
                    </div>
                    <div>
                        <select defaultValue={this.state.student.studentGender} disabled>
                            <option value={0}>Nam</option>
                            <option value={1}>Nữ</option>
                        </select>
                    </div>
                    <div>
                        <input type="date" defaultValue={this.state.student.studentDateOfBirth} disabled/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.state.student.studentPhone} disabled/>
                    </div>
                    <div>
                        <input type="number" name="studentCount" onChange={(e) => this.handleChange(e)} defaultValue={this.state.student.studentCount}/>
                    </div>
                    <div>
                        <input type="text" name="studentScore" onChange={(e) => this.handleChange(e)} defaultValue={this.state.student.studentScore}/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.state.student.studentCourseId} disabled/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.state.student.studentCourseName} disabled/>
                    </div>
                    <div>
                        <button type="submit">Lưu</button>
                    </div>
                </form>
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