import { REST, Routes, APIApplicationCommand } from 'discord.js';
import { constants } from '../../constants';

const rest = new REST({ version: '10' }).setToken(constants.TOKEN);

function mapLocalToExistingCommands(
    localCommands: APIApplicationCommand[],
    remoteCommands: APIApplicationCommand[]
): [APIApplicationCommand | null, APIApplicationCommand | null][] {
    const mapped: [APIApplicationCommand | null, APIApplicationCommand | null][] = [];

    for (const local of localCommands) {
        const remote = remoteCommands.find((it) => it.name === local.name);
        mapped.push([local, remote || null]);
    }

    for (const remote of remoteCommands) {
        const local = localCommands.find((it) => it.name === remote.name);
        if (!local) {
            mapped.push([null, remote]);
        }
    }

    return mapped;
}

export async function updateCommands(localCommands: APIApplicationCommand[]): Promise<void> {
    const remoteCommands = (await rest.get(
        Routes.applicationCommands(constants.CLIENT_ID)
    )) as APIApplicationCommand[];

    console.log(`Started updaing application / commands.`);

    for (const [local, remote] of mapLocalToExistingCommands(localCommands, remoteCommands)) {
        if (!remote) {
            console.log(`\t|-Creating command ${local!.name}`);
            await rest.post(Routes.applicationCommands(constants.CLIENT_ID), { body: local });

        } else if (local) {
            if (local.description === remote.description) {
                continue;
            }
            console.log(`\t|-Updating command ${local.name}`);
            await rest.patch(Routes.applicationCommand(constants.CLIENT_ID, remote.id), { body: local });

        } else {
            console.log(`\t|-Deleting command ${remote.name}`);
            await rest.delete(Routes.applicationCommand(constants.CLIENT_ID, remote.id));
        }
    };

    console.log(`Successfully updated application / commands.`);
}
