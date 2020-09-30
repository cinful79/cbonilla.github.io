const inquirer = require('inquirer');
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const templateManager = require('./src/html-template');

//format of acceptable numbers 123-123-1231
const officeNumRegex =  /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/;	

const emailRegex = /\w+@\w+\.(net|com|org|edu)/;



const employeeArray = [];

promptEmployee = () => {

  console.log("\x1b[33m",`
 ✨¸¸.•*¨*•♫♪¸¸.•*¸¸.•*¨*•♫♪¸¸.•*✨
`);
console.log("\x1b[36m",`✨ Team Profile Generator 1.0.0 ✨`);
  console.log("\x1b[33m", ` 
 ✨¸¸.•*¨*•♫♪¸¸.•*¸¸.•*¨*•♫♪¸¸.•*✨
  `);
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employeeType',
      message: 'Which type of employee would you like to add?',
      choices: ['Manager', 'Engineer', 'Intern']
    },
    {// ask for name
      type: 'input',
      name: 'name',
      message: "What is this employee's first name?",
      validate: name => {
        if (name) {
          return true;
        } else if (!name) {
          console.log(" ✨Please Enter a Name")
          return false;
        }
      }
    },
    //when employeeType === Manager
    {
      type: 'input',
      name: 'officeNum',
      message: "What is the office number of this Manager?",
      when: ({ employeeType }) => employeeType === 'Manager',
      validate: officeNum => {
        if (officeNumRegex.test(officeNum)) {
          return true;
        } else {
          console.log(" ✨Please enter in this format (123) 456-7890 or 123-456-7890");
          return false;
        }
      }
    },
    //when employeeType === Engineer
    {
      type: 'input',
      name: 'github',
      message: "What is this Engineer's github user name?",
      when: ({ employeeType }) => employeeType === 'Engineer'
    },
    //when employeeType === Intern
    {
      type: 'input',
      name: 'school',
      message: 'Which school or university is this Intern from?',
      when: ({ employeeType }) => employeeType === 'Intern'
    },
    //ask for id
    {
      type: 'input',
      name: 'id',
      message: "What is this employee's id number?",
      validate: id => {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
          console.log(" ✨Please enter a number");
          return false;
        } else {
          return true;
        }
      }
    },
    //ask for email
    {
      type: 'input',
      name: 'email',
      message: "What is this employee's email?",
      validate: email => {
        if (emailRegex.test(email)) {
          return true;
        } else {
          console.log(" \n✨Please enter an email in this format example@email.com, .net, or .org")
          return false;
        }
      }
    },
    {
      type: 'confirm',
      name: 'confirmAddEmployee',
      message: 'Would you like to add another Employee?',
      default: false
    }
  ])
  .then(employeeData => {
    //console.log(employeeData);
    //if created employee data is Manager name, id, email, officeNum
    if (employeeData.employeeType === 'Manager') {
      const manager = new Manager(employeeData.name, employeeData.id, employeeData.email, employeeData.officeNum);
      employeeArray.push(manager);
    }
    //if created employee data is Engineer, name, id, email, github
    if (employeeData.employeeType === 'Engineer') {
      const engineer = new Engineer(employeeData.name, employeeData.id, employeeData.email, employeeData.github);
      employeeArray.push(engineer);
    }
    //if created employee data is Intern, name, id, email, school
    if (employeeData.employeeType === 'Intern') {
      const intern = new Intern(employeeData.name, employeeData.id, employeeData.email, employeeData.school);
      employeeArray.push(intern);
    }
    //console.table(employeeArray);
    if(employeeData.confirmAddEmployee) {
      delete employeeData.confirmAddEmployee;
      return promptEmployee();
    } else {
      delete employeeData.confirmAddEmployee;
      employeeData.employees = employeeArray;
      module.exports = {
        employees: employeeData.employees
      };
      return employeeData;
    }
  })
}
const writeHTML = require('./src/write-html.js');

promptEmployee()
.then(employeeData => employeeData)
.then(employeeData2 => {
  //console.log(employeeData2);
  const generateHTML = require('./src/html-template.js');
  return (generateHTML.generateFile(employeeData2));
})
.then(html => {
  console.log("\x1b[33m", `
 ✨¸¸.•*¨*•♫♪¸¸.•*¸¸.•*¨*•♫♪¸¸.•*¸¸.•*¨*•♫♪¸¸.•*¸¸✨
`);console.log("\x1b[32m", 
"✨ HTML Page Generated! Check the ./dist folder! ✨");
  console.log("\x1b[33m", `
 ✨¸¸.•*¨*•♫♪¸¸.•*¸¸.•*¨*•♫♪¸¸.•*¸¸.•*¨*•♫♪¸¸.•*¸¸✨
`, "\x1b[00m")
  return writeHTML.writeFile(html);
})
.catch(err => console.log(err));