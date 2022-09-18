import fs from "fs/promises"
import chalk from "chalk";
import inquirer from 'inquirer';

const setup = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'client_id',
            message: 'Enter your client ID'
        },
        {
            type: 'input',
            name: 'client_secret',
            message: 'Enter your client secret'
        },
    ]);
    try {
        await fs.writeFile("./config.json", JSON.stringify(answers))
        console.log(chalk.green("Successfully wrote config file!"))
    } catch (error) {
        console.log(chalk.red("Failed to write config file!"))
    }
}

setup()