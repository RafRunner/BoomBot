import {
    REST,
    Routes,
    RESTGetAPIApplicationCommandsResult,
    APIApplicationCommand,
} from 'discord.js';
import { constants } from './constants';

const rest = new REST({ version: '10' }).setToken(constants.TOKEN);

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
] as APIApplicationCommand[];

function mapCommandsToExistingCommands(
    existingCommands: RESTGetAPIApplicationCommandsResult
): Map<APIApplicationCommand, APIApplicationCommand | null> {
    return commands.reduce(
        (map: Map<APIApplicationCommand, APIApplicationCommand | null>, command: APIApplicationCommand) => {
            const old = existingCommands.find((it) => it.name == command.name);
            map.set(command, old || null);
            return map;
        },
        new Map()
    );
}

function findDeletedCommands(existingCommands: RESTGetAPIApplicationCommandsResult): APIApplicationCommand[] {
    const commandNames = commands.map((it) => it.name);
    return existingCommands.filter(({ name }) => {
        return !commandNames.some(it => it === name);
    });
}

export async function updateCommands(): Promise<void> {
    const existingCommands = (await rest.get(
        Routes.applicationCommands(constants.CLIENT_ID)
    )) as RESTGetAPIApplicationCommandsResult;

    console.log(`Started updaing application / commands.`);

    mapCommandsToExistingCommands(existingCommands).forEach(async (oldCommand, command) => {
        if (!oldCommand) {
            console.log(`|-Creating command ${command.name}`);
            await rest.post(Routes.applicationCommands(constants.CLIENT_ID), { body: command });
        } else {
            if (oldCommand.description === command.description) {
                return;
            }
            console.log(`|-Updating command ${command.name}`);
            await rest.patch(Routes.applicationCommand(constants.CLIENT_ID, oldCommand.id), { body: command });
        }
    });

    findDeletedCommands(existingCommands).forEach(async (deletedCommand) => {
        console.log(`|-Deleting command ${deletedCommand.name}`);
        await rest.delete(Routes.applicationCommand(constants.CLIENT_ID, deletedCommand.id));
    });

    console.log(`Successfully updated application / commands.`);
}
