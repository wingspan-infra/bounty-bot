# Technical Scope: BountyBot Brokerage Manager (Node.js)

## 1. System Overview
BountyBot is a Brokerage Service Management tool for EVE Online. Its primary purpose is to track customer requests for specific wormhole types and manage the lifecycle of "find-and-sell" operations. The system serves as a central registry for all requested wormholes, allowing scouts to match discovered systems against open brokerage orders.

## 2. Functional Requirements

### A. Brokerage Order Tracking (CRM)
The bot must manage the lifecycle of service requests:
* **Specific Request Tracking (J-Codes)**: Track high-priority orders for specific systems, including customer notes and "Watchlist" status.
* **Generic Standing Orders**: Track broad requests based on system attributes (e.g., "C2 with C5 static").
* **Order Search & Matching**: Provide a query engine to match discovered J-codes against existing generic and specific orders to identify potential sales.

### B. Wormhole Intelligence Service
To support brokerage accuracy, the bot provides static data lookups:
* **System Characteristics**: Retrieve class, security status, and celestial data for any J-code.
* **Static Mapping**: Look up specific wormhole static codes (e.g., D382) to confirm if a system meets a customer's specific requirements.

### C. Logistics & Mass Calculation
For delivery of the "product" (the wormhole), the bot tracks transit safety:
* **Mass Tracking**: Calculate ship mass impact on wormholes during the transit of customers or scouts.
* **Stability Monitoring**: Track wormhole health (Healthy/Shrunk/Critical) to prevent accidental collapse during a brokerage sale.
* **Probability Engine**: Determine the risk of collapse when a ship's mass might exceed the estimated remaining allowance.

## 3. Command Interface (Brokerage Workflow)
* **Order Management**: `/add`, `/edit`, `/remove` orders (Restricted to Broker/Config channels).
* **Intelligence**: `/check`, `/info`, `/search` to verify if a scouted system matches an order.
* **Operations**: `/spawn`, `/splash`, `/chance` to manage the physical delivery and mass of the wormhole being sold.

## 4. Technical Constraints
* **Platform**: Node.js with `discord.js`.
* **State Management**: Asynchronous handling of active "Spawned" wormholes to allow multiple concurrent brokerage operations.
* **Database**: Persistent storage of orders and static EVE data using SQLite (`better-sqlite3`).