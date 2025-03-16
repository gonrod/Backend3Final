import TicketDAO from '../daos/TicketDAO.js';
import TicketDTO from '../../dtos/TicketDTO.js';

class TicketRepository {
    /**
     * Creates a new ticket and returns a DTO.
     * @param {Object} ticketData - Data for the new ticket.
     * @returns {Promise<TicketDTO>} The newly created ticket DTO.
     */
    async createTicket(ticketData) {
        try {
            const newTicket = await TicketDAO.createTicket(ticketData);
            if (!newTicket) throw new Error("El ticket no se pudo crear.");
            
            return newTicket;
        } catch (error) {
            console.error("❌ Error en TicketRepository al crear ticket:", error);
            throw error;
        }
    }

    /**
     * Retrieves a ticket by its ID and returns a DTO.
     * @param {string} ticketId - The ID of the ticket.
     * @returns {Promise<TicketDTO|null>} The ticket DTO or null if not found.
     */
    async getTicketById(ticketId) {
        try {
            const ticket = await TicketDAO.getTicketById(ticketId);
            if (!ticket) return null;
            return ticket;
        } catch (error) {
            console.error("❌ Error en TicketRepository al obtener ticket:", error);
            throw error;
        }
    }

    /**
     * Retrieves all tickets and returns them as DTOs.
     * @returns {Promise<Array<TicketDTO>>} Array of ticket DTOs.
     */
    async getAllTickets() {
        try {
            const tickets = await TicketDAO.getAllTickets();
            return tickets.map(ticket => new TicketDTO(ticket));
        } catch (error) {
            console.error("❌ Error en TicketRepository al obtener todos los tickets:", error);
            throw error;
        }
    }
}

export default new TicketRepository();
