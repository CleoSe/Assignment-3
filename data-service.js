const fs = require("fs");

let employees = [];
let departments = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/departments.json", "utf8", (err, data) => {
      if (err) {
        reject("Unable to read the file: departments.json");
        return;
      }
      departments = JSON.parse(data);

      fs.readFile("./data/employees.json", "utf8", (err, data) => {
        if (err) {
          reject("Unable to read the file: employees.json");
          return;
        }
        employees = JSON.parse(data);

        resolve();
      });
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (employees.length == 0) {
      reject("No employees found");
      return;
    }

    resolve(employees);
  });
};

module.exports.getManagers = function () {
  return new Promise(function (resolve, reject) {
    var filteredEmployeees = [];

    for (let i = 0; i < employees.length; i++) {
      if (employees[i].isManager == true) {
        filteredEmployeees.push(employees[i]);
      }
    }

    if (filteredEmployeees.length == 0) {
      reject("No managers found");
      return;
    }

    resolve(filteredEmployeees);
  });
};

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    if (departments.length == 0) {
      reject("No departments found");
      return;
    }

    resolve(departments);
  });
};



module.exports.addEmployee = function addEmployee(employeeData) {
  return new Promise((resolve, reject) => {

    if (employeeData.isManager === undefined) {
      employeeData.isManager = false;
    } else {
      employeeData.isManager = true;
    }

    employeeData.employeeNum = employees.length + 1;

    employees.push(employeeData);

    resolve();
  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise((resolve, reject) => {

    let filteredEmployees = employees.filter(emp => emp.status == status);

    if (filteredEmployees.length > 0) {
      resolve(filteredEmployees);
    } else {
      reject("No employees found with the specified status");
    }

  });
};

module.exports.getEmployeesByDepartment = function (department) {
  return new Promise((resolve, reject) => {

    let filteredEmployees = employees.filter(emp => emp.department == department);

    if (filteredEmployees.length > 0) {
      resolve(filteredEmployees);
    } else {
      reject("No employees found in this department");
    }

  });
};

module.exports.getEmployeesByManager = function (manager) {
  return new Promise((resolve, reject) => {

    let filteredEmployees = employees.filter(emp => emp.employeeManagerNum == manager);

    if (filteredEmployees.length > 0) {
      resolve(filteredEmployees);
    } else {
      reject("No employees found for this manager");
    }

  });
};

module.exports.getEmployeeByNum = function(num){
    return new Promise((resolve, reject) => {

        let foundEmployee = employees.find(emp => emp.employeeNum == num);

        if(foundEmployee){
            resolve(foundEmployee);
        } else {
            reject("No employee found");
        }

    });
};
