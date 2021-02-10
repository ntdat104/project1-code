import React, { Component } from 'react';

//TODO COMPONENTS
import Profile from './Profile';
import EditProfile from './EditProfile';
import ClassList from './ClassList';
import ClassInfo from './ClassInfo';

//TODO SCSS
import "../scss/Teacher.scss";

class Teacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "CLASS_LIST"
        };
    }

    option() {
        switch (this.state.status) {
            case "PROFILE":
                return <Profile 
                            teacherid={this.props.teacherid}
                            signOut={() => this.props.signOut()}
                            changeStatus={(status) => this.changeStatus(status)}
                        />
            case "EDIT_PROFILE":
                return <EditProfile
                            teacherid={this.props.teacherid}
                            changeStatus={(status) => this.changeStatus(status)}
                        />
            case "CLASS_LIST":
                return <ClassList 
                            teacherid={this.props.teacherid}
                            changeStatus={(status) => this.changeStatus(status)}
                            getClassId={(classid) => this.getClassId(classid)}
                        />
            case "CLASS_INFO":
                return <ClassInfo
                            teacherid={this.props.teacherid}
                            classid={this.state.classid}
                        />
            default:
                break;
        }
    }

    changeStatus(status) {
        this.setState({
            status: status
        });
    }

    getClassId(classid) {
        this.setState({
            classid: classid
        });
    }
    
    render() {
        return (
            <div className="teacher">
                {this.option()}
                <div className="btn">
                    <button onClick={() => this.changeStatus("CLASS_LIST")}>Lớp học</button>
                    <button onClick={() => this.changeStatus("PROFILE")}>Cá nhân</button>
                </div>
            </div>
        );
    }
}

export default Teacher;