const db = require('./database');
const { getSystemDetails } = require('./intelService');

/**
 * REPLACES: add_jcode and add_generic
 * Adds a new brokerage order to the database.
 */
function addOrder(customer, description, jcode = null) {
    const date = new Date().toISOString().split('T')[0];
    
    if (jcode) {
        // Specific Order Logic
        const details = getSystemDetails(jcode);
        if (!details) return { success: false, message: "Invalid J-Code." };

        const stmt = db.prepare(`
            INSERT INTO specific_orders (name, customer, comments, date_added) 
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(jcode.toUpperCase(), customer, description, date);
        return { success: true, message: `Order added for ${customer}: ${jcode.toUpperCase()}` };
    } else {
        // Generic Order Logic
        const stmt = db.prepare(`
            INSERT INTO generic_orders (customer, description, date_added) 
            VALUES (?, ?, ?)
        `);
        stmt.run(customer, description, date);
        return { success: true, message: `Generic order added for ${customer}: "${description}"` };
    }
}

/**
 * REPLACES: verify_generic
 * Logic: Checks if a scouted J-code matches any open customer orders.
 */
function findMatches(jcode) {
    const matches = [];
    const details = getSystemDetails(jcode);
    if (!details) return matches;

    // 1. Check Specific Orders
    const specific = db.prepare('SELECT customer FROM specific_orders WHERE name = ?')
                      .all(jcode.toUpperCase());
    specific.forEach(row => matches.push(`${row.customer} (Direct Target)`));

    // 2. Check Generic Orders
    // Get destinations from your ripped Go data
    const destinations = details.details.map(d => d.leadsTo.toLowerCase());
    
    const generics = db.prepare('SELECT id, customer, description FROM generic_orders').all();
    
    for (const order of generics) {
        const req = order.description.toLowerCase();
        // Matching logic: If any destination class (e.g., C6) is in the customer request string
        if (destinations.some(dest => req.includes(dest.replace('class ', 'c')))) {
            matches.push(`${order.customer} (Generic #${order.id})`);
        }
    }

    return matches;
}

/**
 * REPLACES: __list_jcode_detail
 * Returns all active orders for the brokerage portfolio.
 */
function listAllOrders() {
    const specific = db.prepare('SELECT * FROM specific_orders').all();
    const generic = db.prepare('SELECT * FROM generic_orders').all();
    return { specific, generic };
}

module.exports = { addOrder, findMatches, listAllOrders };