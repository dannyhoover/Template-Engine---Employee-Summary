const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

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
    employees.push(new Intern(intern.name, intern.id, intern.email, intern.school));
    return getTeamData();
  });
}

getManagerData().then(function(manager) {
  employees.push(new Manager(manager.name, manager.id, manager.email, manager.officeNumber));
  return getTeamData();
}).then(() => {
  return render(employees);
}).then((html) => {
  fs.writeFile("./output/team.html", html, function(err) {
    if (err) console.error(err);
  })
  // write to output/team.html
})


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
