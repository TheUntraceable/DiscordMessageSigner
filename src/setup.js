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
        {
            type: 'input',
            name: 'public_key',
            message: 'Enter your public key'
        },
        {
            type: 'input',
            name: 'private_key',
            message: 'Enter your private key'
        }
    ]);
    try {
        await fs.writeFile("./config.json", JSON.stringify(answers))
        console.log(chalk.green("Successfully wrote config file!"))
    } catch (error) {
        console.log(chalk.red("Failed to write config file!"))
    }
}

setup()