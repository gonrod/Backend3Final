import Ticket from '../models/Ticket.js';

class TicketDAO {
    /**
     * Creates a new ticket in the database.
     * @param {Object} ticketData - Data for the new ticket.
     * @returns {Promise<Object>} The created ticket.
     */
    async createTicket(ticketData) {
        try {
            const newTicket = await Ticket.create(ticketData);
            return newTicket; // Retorna el objeto Ticket sin convertirlo en DTO
        } catch (error) {
            console.error("❌ Error en TicketDAO al crear ticket:", error);
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
            if (!ticketId) throw new Error("El ID del ticket es inválido");

            const ticket = await Ticket.findById(ticketId);

            if (!ticket) throw new Error("Ticket no encontrado en la BD");

            return ticket;
        } catch (error) {
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
