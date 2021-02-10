import React, { Component } from 'react';

//TODO API
import { getDataClass } from "../api/Database";

//TODO SCSS
import "../scss/ClassList.scss";

class ClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async getData() {
        const DataClass = await getDataClass();
        let classes = [];
        DataClass.forEach((element) => {
            if(element.teacherid === this.props.teacherid) {
                classes.push(element.classid)
            }
        });
        this.setState({ classes: classes });
    }
    
    componentDidMount() {
        this.getData();
    }

    handleClick(element) {
        this.props.getClassId(element);
        this.props.changeStatus("CLASS_INFO");
    }

    mapClass() {
        return this.state.classes.map((element, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{element}</td>
                <td>
                    <button onClick={() => this.handleClick(element)}>Xem</button>
                </td>
            </tr>
        ))
    }

    renderClassList() {
        if(this.state.classes) {
            return (
                <div className="class_list">
                    <h1>Danh sách lớp</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã lớp</th>
                                <th>Chức năng</th>
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