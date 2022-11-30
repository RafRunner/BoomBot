import * as dotenv from 'dotenv';

dotenv.config();

import { client } from './createClient';
import { ActivityType, Interaction } from 'discord.js';
import { constants } from './constants';
import { updateCommands } from './updateCommands';

client.on('ready', () => {
    client.user?.setActivity('music! Use /help to see more', { type: ActivityType.Listening });
    console.log(`Logged in as ${client.user?.username}`)
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

updateCommands().then(() => {
    client.login(constants.TOKEN);
});
