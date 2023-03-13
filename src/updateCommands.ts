import {
    REST,
    Routes,
    APIApplicationCommand,
} from 'discord.js';
import { constants } from './constants';

const rest = new REST({ version: '10' }).setToken(constants.TOKEN);

function mapCommandsToExistingCommands(
    allCommands: APIApplicationCommand[],
    existingCommands: APIApplicationCommand[]
): Map<APIApplicationCommand, APIApplicationCommand | null> {
    return allCommands.reduce(
        (map: Map<APIApplicationCommand, APIApplicationCommand | null>, command: APIApplicationCommand) => {
            const old = existingCommands.find((it) => it.name == command.name);
            map.set(command, old || null);
            return map;
        },
        new Map()
    );
}

function findDeletedCommands(
    allCommands: APIApplicationCommand[],
    existingCommands: APIApplicationCommand[]
): APIApplicationCommand[] {
    const commandNames = allCommands.map((it) => it.name);
    return existingCommands.filter(({ name }) => commandNames.indexOf(name) === -1);
}

export async function updateCommands(allCommands: APIApplicationCommand[]): Promise<void> {
    const existingCommands = (await rest.get(
        Routes.applicationCommands(constants.CLIENT_ID)
    )) as APIApplicationCommand[];

    console.log(`Started updaing application / commands.`);

    mapCommandsToExistingCommands(allCommands, existingCommands).forEach(async (oldCommand, command) => {
        if (!oldCommand) {
            console.log(`\t|-Creating command ${command.name}`);
            await rest.post(Routes.applicationCommands(constants.CLIENT_ID), { body: command });
        } else {
            if (oldCommand.description === command.description) {
                return;
            }
            console.log(`\t|-Updating command ${command.name}`);
            await rest.patch(Routes.applicationCommand(constants.CLIENT_ID, oldCommand.id), { body: command });
        }
    });

    findDeletedCommands(allCommands, existingCommands).forEach(async (deletedCommand) => {
        console.log(`\t|-Deleting command ${deletedCommand.name}`);
        await rest.delete(Routes.applicationCommand(constants.CLIENT_ID, deletedCommand.id));
    });

    console.log(`Successfully updated application / commands.`);
}
