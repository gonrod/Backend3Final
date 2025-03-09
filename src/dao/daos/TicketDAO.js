import Ticket from '../models/Ticket.js';

class TicketDAO {
    /**
     * Creates a new ticket in the database.
     * @param {Object} ticketData - Data for the new ticket.
     * @returns {Promise<Object>} The created ticket.
     */
    async createTicket(ticketData) {
        try {
            const newTicket = new Ticket(ticketData);
            return await newTicket.save();
        } catch (error) {
            console.error("❌ Error creating ticket:", error);
            throw error;
        }
    }

    /**
     * Retrieves a ticket by ID and populates related user and product data.
     * @param {string} ticketId - The ID of the ticket.
     * @returns {Promise<Object>} The retrieved ticket.
     */
    async getTicketById(ticketId) {
        try {
            return await Ticket.findById(ticketId)
                .populate('user')
                .populate('products.product');
        } catch (error) {
            console.error("❌ Error fetching ticket by ID:", error);
            throw error;
        }
    }

    /**
     * Retrieves all tickets from the database.
     * @returns {Promise<Array>} An array of all tickets.
     */
    async getAllTickets() {
        try {
            return await Ticket.find()
                .populate('user')
                .populate('products.product');
        } catch (error) {
            console.error("❌ Error fetching all tickets:", error);
            throw error;
        }
    }
}

export default new TicketDAO();
