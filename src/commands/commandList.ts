import { APIApplicationCommand } from "discord.js";

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'pong',
        description: 'Replies with Ping!',
    }
] as APIApplicationCommand[];

export { commands };
