import { Constants } from 'discord.js';
import { exit } from 'process';

const token: string | undefined = process.env.TOKEN;
const clientId: string | undefined = process.env.CLIENT_ID;

if (!token || !clientId) {
    console.error('No discord bot token or client id defined on environment. Exiting...');
    exit(1);
}

type Constants = {
    TOKEN: string,
    CLIENT_ID: string,
}

const constants: Constants = {
    TOKEN: token,
    CLIENT_ID: clientId,
}

export { constants };
