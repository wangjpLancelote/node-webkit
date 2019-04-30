const inquirer = require("inquirer");

inquirer.prompt([{
    type: 'input',
    name: '比赛场id',
    message: '请输入比赛场id',
    default: true,
    when: true
}]).then((answers) => {console.log("结果：" , answers)});