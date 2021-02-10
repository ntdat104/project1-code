import firebase from 'firebase/app';
import 'firebase/database';

var Config = {
  apiKey: "AIzaSyDu7RYF7A3eaC2uedmAEUFyz1u14d1def4",
  authDomain: "class-104.firebaseapp.com",
  databaseURL: "https://class-104.firebaseio.com",
  projectId: "class-104",
  storageBucket: "class-104.appspot.com",
  messagingSenderId: "642296584585",
  appId: "1:642296584585:web:a63c7c9e96c03e203e6958"
};
// Initialize Firebase

firebase.initializeApp(Config);

// API
const database = firebase.database();

function getDataRef(ref) {
  return new Promise((resolve, reject) => {
    database.ref(ref).on("value", (snapshot) => {
      let Result = [];
      snapshot.forEach((element) => {
        Result.push(element.val());
      })
      resolve(Result)
    })
  })
}

function getDataAdmin() {
  return new Promise((resolve, reject) => {
    database.ref("admin").on("value", (snapshot) => {
      resolve(snapshot.val())
    })
  })
}

function getDataClass() {
  return new Promise((resolve, reject) => {
    database.ref("class").on("value", (snapshot) => {
      let Class = [];
      snapshot.forEach((element) => {
        Class.push(element.val());
      })
      resolve(Class)
    })
  })
}

function getDataClassMember() {
  return new Promise((resolve, reject) => {
    database.ref("class_member").on("value", (snapshot) => {
      let ClassMember = [];
      snapshot.forEach((element) => {
        ClassMember.push(element.val());
      })
      resolve(ClassMember)
    })
  })
}

function getDataCourse() {
  return new Promise((resolve, reject) => {
    database.ref("course").on("value", (snapshot) => {
      let Course = [];
      snapshot.forEach((element) => {
        Course.push(element.val());
      })
      resolve(Course)
    })
  })
}

function getDataStudent() {
  return new Promise((resolve, reject) => {
    database.ref("student").on("value", (snapshot) => {
      let Student = [];
      snapshot.forEach((element) => {
        Student.push(element.val());
      })
      resolve(Student)
    })
  })
}

function getDataTeacher() {
  return new Promise((resolve, reject) => {
    database.ref("teacher").on("value", (snapshot) => {
      let Teacher = [];
      snapshot.forEach((element) => {
        Teacher.push(element.val());
      })
      resolve(Teacher)
    })
  })
}

export {
  database,
  getDataRef,
  getDataAdmin,
  getDataClass,
  getDataClassMember,
  getDataCourse,
  getDataStudent,
  getDataTeacher
}