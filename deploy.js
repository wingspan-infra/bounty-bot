const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('static')
        .setDescription('Lookup mass/jump limits for a static code')
        .addStringOption(opt => opt.setName('code').setDescription('e.g. U319').setRequired(true)),

    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays destinations of a J-Code')
        .addStringOption(opt => opt.setName('jcode').setDescription('e.g. J105556').setRequired(true)),

    new SlashCommandBuilder()
        .setName('check')
        .setDescription('Match a J-Code against customer orders')
        .addStringOption(opt => opt.setName('jcode').setDescription('The found system').setRequired(true)),

    new SlashCommandBuilder()
        .setName('request')
        .setDescription('Add a new brokerage order')
        .addStringOption(opt => opt.setName('customer').setDescription('Client name').setRequired(true))
        .addStringOption(opt => opt.setName('details').setDescription('Criteria or J-Code').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log(`🚀 Deploying ${commands.length} commands to Local Server...`);

        // Routes.applicationGuildCommands targets only your GUILD_ID
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('✅ Local commands reloaded! Check Discord now.');
    } catch (error) {
        console.error('❌ Deployment failed:', error);
    }
})();