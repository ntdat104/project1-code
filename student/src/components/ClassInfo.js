import React, { Component } from "react";

//TODO API
import {
	getDataClassMember,
	getDataClass,
	getDataCourse,
	getDataTeacher,
} from "../api/Database";

//TODO SCSS
import "../scss/ClassInfo.scss";

class ClassInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			render: 0,
		};
	}

	async getData() {
		const DataClassMember = await getDataClassMember();
		const ClassMember = DataClassMember.filter(
			(element) =>
				element.classid === this.props.classid &&
				element.studentid === this.props.studentid
		)[0];

		const DataClass = await getDataClass();
		const Class = DataClass.filter(
			(element) => element.classid === this.props.classid
		)[0];

		const DataCourse = await getDataCourse();
		const Course = DataCourse.filter(
			(element) => element.courseid === Class.courseid
		)[0];

		const DataTeacher = await getDataTeacher();
		const Teacher = DataTeacher.filter(
			(element) => element.teacherid === Class.teacherid
		)[0];

		const classInfo = {
			classid: this.props.classid,
			courseid: Course.courseid,
			coursename: Course.name,
			studentid: this.props.studentid,
			count: ClassMember.count,
			score: ClassMember.score,
			teachername: Teacher.name,
			teacherphone: Teacher.phone,
		};

		this.setState({ classInfo: classInfo });
	}

	componentDidMount() {
		this.getData();
	}

	renderClassInfo() {
		if (this.state.classInfo) {
			return (
				<div className="class_info">
					<h1>Thông tin lớp {this.state.classInfo.classid}</h1>
					<ul>
						<li>
							<h2>Mã khóa học</h2>
							<p>{this.state.classInfo.courseid}</p>
						</li>
						<li>
							<h2>Tên Khóa học</h2>
							<p>{this.state.classInfo.coursename}</p>
						</li>
						<li>
							<h2>Mã lớp học</h2>
							<p>{this.state.classInfo.classid}</p>
						</li>
						<li>
							<h2>Mã học sinh</h2>
							<p>{this.state.classInfo.studentid}</p>
						</li>
						<li>
							<h2>Số buổi học</h2>
							<p>{this.state.classInfo.count}</p>
						</li>
						<li>
							<h2>Điểm</h2>
							<p>{this.state.classInfo.score}</p>
						</li>
						<li>
							<h2>Giáo viên phụ trách</h2>
							<p>{this.state.classInfo.teachername}</p>
						</li>
						<li>
							<h2>Số điện thoại</h2>
							<p>{this.state.classInfo.teacherphone}</p>
						</li>
					</ul>
				</div>
			);
		}
	}

	render() {
		return <div className="container">{this.renderClassInfo()}</div>;
	}
}

export default ClassInfo;
