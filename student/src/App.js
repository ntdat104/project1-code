import React, { Component } from "react";

//TODO API
import { getDataStudent } from "./api/Database";
import { HMAC_SHA256 } from "./api/Authentication";

//TODO COMPONENTS
import Login from "./components/Login";
import Student from "./components/Student";

//TODO SCSS
import "./App.scss";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const studentid = JSON.parse(sessionStorage.getItem("studentid"));
		if (studentid) {
			this.setState({ studentid: studentid });
		}
	}

	async checkAccount(account) {
		const students = await getDataStudent();
		const student = students.filter(
			(student) =>
				account.username === student.username &&
				HMAC_SHA256(account.password, student.salt) === student.hash
		)[0];
		if (student) {
			alert("Đăng nhập thành công.");
			this.setState({
				studentid: student.studentid,
			});
			sessionStorage.setItem(
				"studentid",
				JSON.stringify(student.studentid)
			);
		} else alert("Sai mật khẩu hoặc tài khoản không tồn tại.");
	}

	renderApp() {
		if (this.state.studentid) {
			return (
				<Student
					studentid={this.state.studentid}
					signOut={() => this.signOut()}
				/>
			);
		}
		return <Login checkAccount={(account) => this.checkAccount(account)} />;
	}

	signOut() {
		sessionStorage.clear();
		this.setState({ studentid: null });
	}

	render() {
		return <div>{this.renderApp()}</div>;
	}
}

export default App;
