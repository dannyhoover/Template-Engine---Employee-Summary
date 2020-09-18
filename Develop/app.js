const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is the name of the employee?"
  },
  {
    type: "number",
    name: "id",
    message: "What is the id of the employee?"
  },
  {
    type: "email",
    name: "email",
    message: "What is the email of the employee?",
    validate: function(email) {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
      if (regex.test(email)) {
        return true;
      }
      else return "Please enter a valid email";
    }
  },
];

const employees = [];

function getManagerData() {
  return inquirer.prompt([...employeeQuestions, {
    type: "number",
    name: "officeNumber",
    message: "What is the manager's office number?"
  }]);
}

function getTeamData() {
  return inquirer.prompt([{
    type: "list",
    name: "employeeType",
    message: "Which kind of employee would you like to add to the team?",
    choices: [
      {
        name: "Engineer",
        value: getEngineerData
      },
      {
        name: "Intern",
        value: getInternData
      },
      {
        name: "Finish",
        value: function() {
          console.log("Finished entering team members");
        }
      },
    ]
  }]).then(function(answers) {
    return answers.employeeType();
  });
}

function getEngineerData() {
  return inquirer.prompt([...employeeQuestions, {
    type: "input",
    name: "github",
    message: "What is the github of the engineer?"
  }]).then(function(engineer) {
    employees.push(new Engineer(engineer.name, engineer.id, engineer.email, engineer.github));
    return getTeamData();
  });;
}

function getInternData() {
  return inquirer.prompt([...employeeQuestions, {
    type: "input",
    name: "schoolName",
    message: "What is the name of the interns school?"
  }]).then(function(intern) {
    employees.push(new Intern(intern.name, intern.id, intern.email, intern.schoolName));
    return getTeamData();
  });
}

getManagerData().then(function(manager) {
  employees.push(new Manager(manager.name, manager.id, manager.email, manager.officeNumber));
  return getTeamData();
}).then(() => {
  return render(employees);
}).then((html) => {
    console.log(html);
  fs.writeFile("./output/team.html", html, function(err) {
    if (err) console.error(err);
  })
})
