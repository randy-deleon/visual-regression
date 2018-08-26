import chalk from 'chalk';

const CYAN = (messageType = `CYAN:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.cyan(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const MAGENTA = (messageType = `MAGENTA:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.magenta(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const GREEN = (messageType = `GREEN:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.green(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const YELLOW = (messageType = `YELLOW:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.yellow(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const RED = (messageType = `RED:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.red(`[${ messageType }]:`) + ` ${ messageValue }`);
};

export { CYAN, GREEN, YELLOW, RED, MAGENTA };
