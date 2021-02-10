import React, { Component } from "react";

//TODO COMPONENTS
import ClassList from "./ClassList";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import ClassInfo from "./ClassInfo";

//TODO SCSS
import "../scss/Student.scss";

class Student extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: "CLASS_LIST",
		};
	}

	option() {
		switch (this.state.status) {
			case "CLASS_LIST":
				return (
					<ClassList
						studentid={this.props.studentid}
						changeStatus={(status) => this.changeStatus(status)}
						getClassId={(classid) => this.getClassId(classid)}
					/>
				);
			case "PROFILE":
				return (
					<Profile
						studentid={this.props.studentid}
						signOut={() => this.props.signOut()}
						changeStatus={(status) => this.changeStatus(status)}
					/>
				);
			case "EDIT_PROFILE":
				return (
					<EditProfile
						studentid={this.props.studentid}
						changeStatus={(status) => this.changeStatus(status)}
					/>
				);
			case "CLASS_INFO":
				return (
					<ClassInfo
						studentid={this.props.studentid}
						classid={this.state.classid}
					/>
				);
			default:
				break;
		}
	}

	changeStatus(status) {
		this.setState({
			status: status,
		});
	}

	getClassId(classid) {
		this.setState({
			classid: classid,
		});
	}

	render() {
		return (
			<div className="student">
				{this.option()}
				<div className="btn">
					<button onClick={() => this.changeStatus("CLASS_LIST")}>
						Lớp học
					</button>
					<button onClick={() => this.changeStatus("PROFILE")}>
						Cá nhân
					</button>
				</div>
			</div>
		);
	}
}

export default Student;
