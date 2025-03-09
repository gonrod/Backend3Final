import Product from '../models/Product.js';

class ProductDAO {
    
    /**
     * Retrieves all products.
     * @returns {Promise<Array>} Array of product objects.
     */
    static async getAll() {
        return await Product.find();
    }

    /**
     * Retrieves products based on optional filters.
     * @param {Object} filters - Filtering options for products.
     * @returns {Promise<Array>} Array of filtered products.
     */
    async getAllProducts(filters = {}) {
        try {
            return await Product.find(filters);
        } catch (error) {
            console.error("❌ Error obteniendo productos:", error);
            throw error;
        }
    }

    /**
     * Retrieves a product by its ID.
     * @param {string} productId - The ID of the product.
     * @returns {Promise<Object>} The product object.
     */
    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            console.error("❌ Error obteniendo producto:", error);
            throw error;
        }
    }

    /**
     * Creates a new product.
     * @param {Object} productData - The data for the new product.
     * @returns {Promise<Object>} The newly created product.
     */
    async createProduct(productData) {
        try {
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            console.error("❌ Error creando producto:", error);
            throw error;
        }
    }

    /**
     * Creates multiple products at once.
     * @param {Array<Object>} products - List of product data.
     * @returns {Promise<Array>} The newly created products.
     */
    async createProducts(products) {
        try {
            return await Product.insertMany(products);
        } catch (error) {
            console.error("❌ Error creando múltiples productos:", error);
            throw error;
        }
    }

    /**
     * Updates an existing product.
     * @param {string} productId - The ID of the product to update.
     * @param {Object} updateData - The update data.
     * @returns {Promise<Object>} The updated product.
     */
    async updateProduct(productId, updateData) {
        try {
            return await Product.findByIdAndUpdate(productId, updateData, { new: true });
        } catch (error) {
            console.error("❌ Error actualizando producto:", error);
            throw error;
        }
    }

    /**
     * Deletes a product by its ID.
     * @param {string} productId - The ID of the product to delete.
     * @returns {Promise<Object>} The deleted product.
     */
    async deleteProduct(productId) {
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            console.error("❌ Error eliminando producto:", error);
            throw error;
        }
    }
}

export default new ProductDAO();
