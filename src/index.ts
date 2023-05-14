import * as dotenv from 'dotenv';

dotenv.config();

import { client } from './clients/discordClient';
import { ActivityType, Interaction } from 'discord.js';
import { constants } from './constants';
import { updateCommands } from './commands/core/updateCommands';
import { commands } from './commands/core/commandList';

client.on('ready', () => {
    client.user!.setActivity('music!', { type: ActivityType.Listening });
    console.log(`Logged in as ${client.user!.username}`)
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'pong') {
        await interaction.reply('Ping!');
    }
});

updateCommands(commands).then(() => {
    client.login(constants.TOKEN);
});
