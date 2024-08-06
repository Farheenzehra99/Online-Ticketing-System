import inquirer from "inquirer";
import { events } from "./data.js";
import { Event, Ticket, User } from "./model.js";
import { v4 as uuidv4 } from "uuid";
import chalk from "chalk";
import { faker } from "@faker-js/faker";

async function createEvent() {
  const answers = await inquirer.prompt([
    { type: "input", name: "title", message: "Enter event title:" },
    { type: "input", name: "date", message: "Enter event date (YYYY-MM-DD):" },
    { type: "input", name: "city", message: "Enter event city:" },
    {
      type: "input",
      name: "ticketStock",
      message: "Enter ticket stock:",
      validate: (input) => !isNaN(parseInt(input)),
    },
  ]);

  const event: Event = {
    id: uuidv4(),
    title: answers.title,
    date: new Date(answers.date),
    city: answers.city,
    ticketStock: parseInt(answers.ticketStock),
  };

  if (event.date <= new Date()) {
    console.log(chalk.red("Event date must be in the future."));
    return;
  }

  events.push(event);
  console.log(chalk.green("Event created successfully."));
}

// list all available events
function listEvents() {
  if (events.length === 0) {
    console.log(chalk.yellow("No events available."));
    return;
  }

  events.forEach((event) => {
    console.log(
      chalk.blue(
        `ID: ${event.id}, Title: ${event.title}, Date: ${event.date}, City: ${event.city}, Tickets: ${event.ticketStock}`
      )
    );
  });
}
// Function to edit an event
async function editEvent() {
  if (events.length === 0) {
      console.log(chalk.yellow('No events available to edit.'));
      return;
  }

  const eventChoices = events.map((event) => ({
      name: `${event.title} - ${event.date.toISOString().split('T')[0]} - ${event.city}`,
      value: event.id,
  }));

  const answers = await inquirer.prompt([
      {
          type: 'list',
          name: 'eventId',
          message: 'Select an event to edit:',
          choices: eventChoices,
      },
      { type: 'input', name: 'title', message: 'Enter new event title (leave blank to keep current):' },
      { type: 'input', name: 'date', message: 'Enter new event date (YYYY-MM-DD, leave blank to keep current):' },
      { type: 'input', name: 'city', message: 'Enter new event city (leave blank to keep current):' },
      {
          type: 'input',
          name: 'ticketStock',
          message: 'Enter new ticket stock (leave blank to keep current):',
          validate: (input) => input === '' || !isNaN(parseInt(input)),
      },
  ]);

  const event = events.find((e) => e.id === answers.eventId);

  if (event) {
      event.title = answers.title || event.title;
      event.date = answers.date ? new Date(answers.date) : event.date;
      event.city = answers.city || event.city;
      event.ticketStock = answers.ticketStock ? parseInt(answers.ticketStock) : event.ticketStock;

      console.log(chalk.green('Event updated successfully.'));
  }
}


// Purchase tickets for selected event
async function purchaseTickets(user: User) {
  const eventChoices = events.map((event) => ({
    name: `${event.title} - ${event.date.toISOString().split("T")[0]} - ${
      event.city
    }`,
    value: event.id,
  }));

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "eventId",
      message: "Select an event:",
      choices: eventChoices,
    },
    {
      type: "input",
      name: "ticketCount",
      message: "Enter number of tickets:",
      validate: (input) => !isNaN(parseInt(input)),
    },
  ]);

  const event = events.find((e) => e.id === answers.eventId);
  const ticketCount = parseInt(answers.ticketCount);

  if (event && event.ticketStock >= ticketCount) {
    //    Payment Process
    const paymentSuccessful = await processPayment();
    if (paymentSuccessful) {
      event.ticketStock -= ticketCount;

      const ticket: Ticket = {
        eventId: event.id,
        eventName: event.title,
        date: new Date(),
        quantity: ticketCount,
        paymentStatus: "Paid"
      };

      user.purchaseHistory.push(ticket);

      console.log(chalk.green("Tickets purchased successfully."));
    } else {
      console.log(chalk.red("Ticket purchase failed. Please try again."));
    }
  } else {
    console.log(chalk.red("Not enough tickets available."));
  }
}

// Simulate payment processing
async function processPayment(): Promise<boolean> {
  const paymentInfo = await inquirer.prompt([
    {
      type: "input",
      name: "cardNumber",
      message: "Enter your credit card number:",
    },
    {
      type: "input",
      name: "expiryDate",
      message: "Enter your card expiry date (MM/YY):",
    },
    { type: "input", name: "cvv", message: "Enter your card CVV:" },
  ]);

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Fake payment processing result
  const paymentSuccessful = faker.datatype.boolean();

  return paymentSuccessful;
}

// View the purchase history for the logged-in user
function viewPurchaseHistory(user: User) {
  if (user.purchaseHistory.length === 0) {
    console.log(chalk.yellow("No purchase history available."));
    return;
  }
  user.purchaseHistory.forEach((ticket) => {
    console.log(
      chalk.blue(
        `Event: ${ticket.eventName}, Date: ${ticket.date}, Payment Status: ${ticket.paymentStatus}`
      )
    );
  });
}

export { createEvent, listEvents, purchaseTickets, viewPurchaseHistory };
