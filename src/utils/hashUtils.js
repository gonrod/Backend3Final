import bcrypt from 'bcrypt';

/**
 * Genera un hash para una contraseña de forma asíncrona.
 * @param {string} password - Contraseña a hashear.
 * @returns {Promise<string>} Hash generado.
 */
export const createHash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara una contraseña con un hash almacenado.
 * @param {string} password - Contraseña ingresada.
 * @param {string} hashedPassword - Hash almacenado.
 * @returns {Promise<boolean>} `true` si es válida, `false` si no.
 */
export const isValidPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Actualiza las contraseñas de los usuarios si no están hasheadas.
 * @param {Object} UserModel - Modelo de usuario de la base de datos.
 */
export const updatePasswords = async (UserModel) => {
    try {
        const users = await UserModel.find();
        for (const user of users) {
            if (!/^\$2[aby]\$/.test(user.password)) {
                user.password = await createHash(user.password);
                await user.save();
                console.log(`✅ Contraseña actualizada para el usuario: ${user.email}`);
            }
        }
    } catch (error) {
        console.error('❌ Error al actualizar contraseñas:', error);
    }
};
