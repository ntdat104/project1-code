import React, { Component } from "react";

//TODO API
import { getDataStudent } from "../api/Database";

//TODO SCSS
import "../scss/Profile.scss";

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	async getData() {
		const DataStudent = await getDataStudent();
		const student = DataStudent.filter(
			(element) => element.studentid === this.props.studentid
		)[0];
		this.setState({ student: student });
	}

	componentDidMount() {
		this.getData();
	}

	renderProfile() {
		if (this.state.student) {
			return (
				<div className="profile">
					<h1>Thông tin cá nhân</h1>
					<div className="btn">
						<button
							onClick={() =>
								this.props.changeStatus("EDIT_PROFILE")
							}
						>
							Sửa thông tin
						</button>
						<button onClick={() => this.props.signOut()}>
							Đăng xuất
						</button>
					</div>
					<ul>
						<li>
							<h2>Tài khoản</h2>
							<p>{this.state.student.username}</p>
						</li>
						<li>
							<h2>Họ và tên</h2>
							<p>{this.state.student.name}</p>
						</li>
						<li>
							<h2>Giới tính</h2>
							<p>
								{parseInt(this.state.student.gender)
									? "Nữ"
									: "Nam"}
							</p>
						</li>
						<li>
							<h2>Ngày sinh</h2>
							<p>{this.state.student.dateofbirth}</p>
						</li>
						<li>
							<h2>Số điện thoại</h2>
							<p>{this.state.student.phone}</p>
						</li>
					</ul>
				</div>
			);
		}
	}

	render() {
		return <div className="container">{this.renderProfile()}</div>;
	}
}

export default Profile;
