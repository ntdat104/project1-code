import React, { Component } from 'react';

//TODO COMPONENTS
import ClassList from './ClassList';
import Teacher from './Teacher';
import Student from './Student';
import ClassInfo from './ClassInfo';
import Course from './Course';

//TODO SCSS
import "../scss/Admin.scss";

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "CLASS_LIST"
        };
    }

    option() {
        switch (this.state.status) {
            case "CLASS_LIST":
                return <ClassList changeStatus={(status, classid) => this.changeStatus(status, classid)}/>
            case "TEACHER":
                return <Teacher />
            case "STUDENT":
                return <Student />
            case "COURSE":
                return <Course />
            case "CLASS_INFO":
                return <ClassInfo classid={this.state.classid}/>
            default:
                break;
        }
    }

    changeStatus(status, classid) {
        this.setState({
            status: status,
            classid: classid
        });
    }
    
    render() {
        return (
            <div className="admin">
                {this.option()}
                <div className="btn">
                    <button onClick={() => this.changeStatus("CLASS_LIST")}>Lớp</button>
                    <button onClick={() => this.changeStatus("TEACHER")}>Giáo viên</button>
                    <button onClick={() => this.changeStatus("STUDENT")}>Học sinh</button>
                    <button onClick={() => this.changeStatus("COURSE")}>Khóa học</button>
                </div>
            </div>
        );
    }
}

export default Admin;