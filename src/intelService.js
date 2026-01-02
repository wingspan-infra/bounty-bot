const fs = require('fs');

// Load your Go-sourced JSON files
const wormholeTypes = JSON.parse(fs.readFileSync('./data/wormholes.json'));
const systemData = JSON.parse(fs.readFileSync('./data/systems.json'));
const staticsMap = JSON.parse(fs.readFileSync('./data/statics.json'));
const effectsMap = JSON.parse(fs.readFileSync('./data/effects.json'));

/**
 * The "Matching Engine" Helper
 * Finds if a system matches a customer's specific needs
 */
function getSystemDetails(jcode) {
    const code = jcode.toUpperCase();
    const staticCodes = staticsMap[code]; // e.g., ["Q003", "Z006"]
    
    if (!staticCodes) return null;

    // Create the 'details' array that orderService.js is looking for
    const detailsArray = staticCodes.map(sCode => ({
        code: sCode,
        leadsTo: wormholeTypes[sCode]?.leadsTo || 'Unknown',
        mass: wormholeTypes[sCode]?.mass || 0
    }));

    // Return the object with the 'details' property to avoid undefined errors
    return { name: code, details: detailsArray };
}

// Helper for simple mass lookups
function getStaticInfo(code) {
    const data = wormholeTypes[code.toUpperCase()];
    if (!data) return `Code ${code} not found.`;
    return `${code} leads to ${data.leadsTo}. Max Jump: ${data.jump.toLocaleString()} kg.`;
}

module.exports = { getStaticInfo, getSystemDetails };