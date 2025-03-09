import bcrypt from 'bcrypt';

/**
 * Hashea la contraseña de forma asíncrona.
 * @param {string} password - Contraseña a hashear.
 * @returns {Promise<string>} Contraseña hasheada.
 */
export const createHash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Verifica si la contraseña ingresada es válida comparándola con el hash.
 * @param {string} password - Contraseña ingresada.
 * @param {string} hashedPassword - Hash almacenado.
 * @returns {Promise<boolean>} `true` si es válida, `false` si no.
 */
export const isValidPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Actualiza las contraseñas de los usuarios en la base de datos si no están hasheadas.
 * @param {Object} UserModel - Modelo de usuario de la base de datos.
 */
export const updatePasswords = async (UserModel) => {
    try {
        const users = await UserModel.find();

        for (const user of users) {
            const isHashed = /^\$2[aby]\$/.test(user.password);
            if (!isHashed) {
                user.password = await createHash(user.password);
                await user.save();
                console.log(`Contraseña actualizada para el usuario con email: ${user.email}`);
            }
        }
        console.log('✅ Todas las contraseñas han sido procesadas.');
    } catch (error) {
        console.error('❌ Error al actualizar contraseñas:', error);
    }
};
