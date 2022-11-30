import {
    REST,
    Routes,
    SlashCommandBuilder,
    RESTGetAPIApplicationCommandsResult,
} from 'discord.js';
import { constants } from './constants';

const rest = new REST({ version: '10' }).setToken(constants.TOKEN);

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong! Updated...',
    },
] as SlashCommandBuilder[];

export async function updateCommands(): Promise<void> {
    const existingCommands = (await rest.get(Routes.applicationCommands(constants.CLIENT_ID))) as RESTGetAPIApplicationCommandsResult;

    const commandsToUpdate = commands.filter((command: SlashCommandBuilder) => {
        const existingCommand = existingCommands.find((c) => c.name === command.name);
        return !existingCommand || existingCommand.description !== command.description;
    });

    const amountToUpdate = commandsToUpdate.length;
    if (amountToUpdate === 0) {
        console.log('No commands to update.');
        return;
    }

    console.log(`Started updaing ${amountToUpdate} / commands.`);
    console.log(`Commands being updated: ${commandsToUpdate.map(it => it.name)}.`)
    await rest.put(Routes.applicationCommands(constants.CLIENT_ID), { body: commandsToUpdate });
    console.log(`Successfully updated ${amountToUpdate} application / commands.`);
}
