const { getStaticInfo, getSystemDetails } = require ('./intelService');
const { findMatches, addOrder } = require ('./orderService');

async function routeInteractions(interaction) {
    const { commandName } = interaction;

    if (commandName == 'static') {
        const code = interaction.options.getString('code');
        const response = getStaticInfo(code);
        await interaction.reply(response);
    }
    
    if (commandName === 'info') {
        const jcode = interaction.options.getString('jcode').toUpperCase();
        const details = getSystemDetails(jcode); // Logic from epicenter.py
        if (!details) return await interaction.reply("Unknown J-Code.");
        
        await interaction.reply(`**${jcode}** leads to: ${details.details.map(d => d.leadsTo).join(', ')}`);
    }

    if (commandName === 'check') {
        const jcode = interaction.options.getString('jcode').toUpperCase();
        const matches = findMatches(jcode);
        const response = matches.length > 0
            ? `✅ Match! Order found for: ${matches.join(', ')}` 
            : `❌ No active orders for ${jcode}.`;
        await interaction.reply(response);
    }

}

module.exports = { routeInteractions }