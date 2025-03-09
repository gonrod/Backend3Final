import User from '../models/User.js';

class UserDAO {
    /**
     * Retrieves a user by ID.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Object>} The user object.
     */
    async getUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            console.error("❌ Error fetching user by ID:", error);
            throw error;
        }
    }

    /**
     * Retrieves a user by email.
     * @param {string} email - The email of the user.
     * @returns {Promise<Object>} The user object.
     */
    async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error("❌ Error fetching user by email:", error);
            throw error;
        }
    }

    /**
     * Creates a new user in the database.
     * @param {Object} userData - The user data.
     * @returns {Promise<Object>} The newly created user.
     */
    async createUser(userData) {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            console.error("❌ Error creating user:", error);
            throw error;
        }
    }

    /**
     * Updates an existing user.
     * @param {string} userId - The ID of the user to update.
     * @param {Object} updateData - The update data.
     * @returns {Promise<Object>} The updated user.
     */
    async updateUser(userId, updateData) {
        try {
            return await User.findByIdAndUpdate(userId, updateData, { new: true });
        } catch (error) {
            console.error("❌ Error updating user:", error);
            throw error;
        }
    }

    /**
     * Retrieves a user by reset token.
     * @param {string} token - The password reset token.
     * @returns {Promise<Object>} The user object.
     */
    async getUserByResetToken(token) {
        try {
            return await User.findOne({ resetToken: token });
        } catch (error) {
            console.error("❌ Error fetching user by reset token:", error);
            throw error;
        }
    }
}

export default new UserDAO();
