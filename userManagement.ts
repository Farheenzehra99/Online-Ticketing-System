import inquirer from 'inquirer';
import { users } from './data.js';
import { User } from './model.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

const saltRounds = 10;

// Signup function to create a new user
async function signup() {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter your name:' },
        { type: 'input', name: 'email', message: 'Enter your email:' },
        { type: 'input', name: 'password', message: 'Enter your password:', validate: (value) => value.trim() !== '' },
        { type: 'password', name: 'confirmPassword', message: 'Confirm your password:', mask: '*' }
        { type: 'confirm',name:'isAdmin',message: 'Are you an admin?', default: false}
    ]);

    if (answers.password !== answers.confirmPassword) {
        console.log(chalk.red('Passwords do not match.'));
        return;
    }

    const hashedPassword = await bcrypt.hash(answers.password, saltRounds);

    const user: User = {
        id: uuidv4(),
        name: answers.name,
        email: answers.email,
        password: hashedPassword,
        isAdmin: answers.isAdmin,
        purchaseHistory: []
    };

    users.push(user);
    console.log(chalk.green('User signed up successfully.'));
}

// Login function to check if the user is valid or not
async function login(): Promise<User | null> {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'email', message: 'Enter your email:' },
        { type: 'password', name: 'password', message: 'Enter your password:', mask: '*' }
    ]);

    const user = users.find(u => u.email === answers.email);

    if (user && await bcrypt.compare(answers.password, user.password)) {
        console.log(chalk.green('Login successful.'));
        return user;
    } else {
        console.log(chalk.red('Invalid email or password.'));
        return null;
    }
}

export { signup, login };
