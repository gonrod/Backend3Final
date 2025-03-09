import UserDAO from '../daos/UserDAO.js';

class UserRepository {
    async getUserById(userId) {
        return await UserDAO.getUserById(userId);
    }

    async getUserByEmail(email) {
        return await UserDAO.getUserByEmail(email);
    }

    async createUser(userData) {
        return await UserDAO.createUser(userData);
    }

    async updateUser(userId, updateData) {
        return await UserDAO.updateUser(userId, updateData);
    }

    async getUserByResetToken(token) {
        return await UserDAO.getUserByResetToken(token);
    }
}

export default new UserRepository();
