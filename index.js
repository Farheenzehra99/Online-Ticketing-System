#! /usr/bin/env node
// import inquirer from 'inquirer';
// import { signup, login } from './userManagement.js';
// import { createEvent, listEvents, purchaseTickets, viewPurchaseHistory } from './eventManagement.js';
// import chalk from 'chalk';
// async function main() {
//     const mainMenuChoices = [
//         { name: 'Sign Up', value: 'signup' },
//         { name: 'Login', value: 'login' },
//         { name: 'Create Event (Admin)', value: 'createEvent' },
//         { name: 'List Events', value: 'listEvents' },
//         { name: 'Purchase Tickets', value: 'purchaseTickets' },
//         { name: 'View Purchase History', value: 'viewPurchaseHistory' },
//         { name: 'Exit', value: 'exit' },
//     ];
//     let user = null;
//     while (true) {
//         const answers = await inquirer.prompt([
//             { type: 'list', name: 'action', message: 'Select an action:', choices: mainMenuChoices },
//         ]);
//         switch (answers.action) {
//             case 'signup':
//                 await signup();
//                 break;
//             case 'login':
//                 user = await login();
//                 break;
//             case 'createEvent':
//                 if (user) {
//                     await createEvent();
//                 } else {
//                     console.log(chalk.red('Please login as admin to create events.'));
//                 }
//                 break;
//             case 'listEvents':
//                 listEvents();
//                 break;
//             case 'purchaseTickets':
//                 if (user) {
//                     await purchaseTickets(user);
//                 } else {
//                     console.log(chalk.red('Please login to purchase tickets.'));
//                 }
//                 break;
//             case'viewPurchaseHistory':
//                 if (user) {
//                     viewPurchaseHistory(user);
//                 } else {
//                     console.log(chalk.red('Please login to view purchase history.'));
//                 }
//                 break;
//             case 'exit':
//                 return;
//         }
//     }
// }
// main();
import inquirer from 'inquirer';
import { signup, login } from './userManagement.js';
import { createEvent, listEvents, purchaseTickets, viewPurchaseHistory, editEvent } from './eventManagement.js';
async function adminMenu(User) {
    const adminMenuChoices = [
        { name: 'Create Event', value: 'createEvent' },
        { name: 'List Events', value: 'listEvents' },
        { name: 'Edit Event', value: 'editEvent' },
        { name: 'Logout', value: 'logout' },
    ];
    while (true) {
        const answers = await inquirer.prompt([
            { type: 'list', name: 'action', message: 'Select an action:', choices: adminMenuChoices },
        ]);
        switch (answers.action) {
            case 'createEvent':
                await createEvent();
                break;
            case 'listEvents':
                listEvents();
                break;
            case 'editEvent':
                await editEvent();
                break;
            case 'logout':
                return;
        }
    }
}
async function userMenu(user) {
    const userMenuChoices = [
        { name: 'List Events', value: 'listEvents' },
        { name: 'Purchase Tickets', value: 'purchaseTickets' },
        { name: 'View Purchase History', value: 'viewPurchaseHistory' },
        { name: 'Logout', value: 'logout' },
    ];
    while (true) {
        const answers = await inquirer.prompt([
            { type: 'list', name: 'action', message: 'Select an action:', choices: userMenuChoices },
        ]);
        switch (answers.action) {
            case 'listEvents':
                listEvents();
                break;
            case 'purchaseTickets':
                await purchaseTickets(user);
                break;
            case 'viewPurchaseHistory':
                viewPurchaseHistory(user);
                break;
            case 'logout':
                return;
        }
    }
}
async function main() {
    const mainMenuChoices = [
        { name: 'Sign Up', value: 'signup' },
        { name: 'Login', value: 'login' },
        { name: 'Exit', value: 'exit' },
    ];
    let user = null;
    while (true) {
        const answers = await inquirer.prompt([
            { type: 'list', name: 'action', message: 'Select an action:', choices: mainMenuChoices },
        ]);
        switch (answers.action) {
            case 'signup':
                await signup();
                break;
            case 'login':
                user = await login();
                if (user) {
                    if (user.isAdmin) {
                        await adminMenu(user);
                    }
                    else {
                        await userMenu(user);
                    }
                }
                break;
            case 'exit':
                return;
        }
    }
}
main();
