import { exit } from 'process';

const token: string | undefined = process.env.TOKEN;
const clientId: string | undefined = process.env.CLIENT_ID;

if (!token || !clientId) {
    console.error('No discord bot token or client id defined on environment. Exiting...');
    exit(1);
}

const constants = {
    TOKEN: token,
    CLIENT_ID: clientId,
}

export { constants };
