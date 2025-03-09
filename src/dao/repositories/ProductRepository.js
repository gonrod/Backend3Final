import ProductDAO from '../daos/ProductDAO.js';

class ProductRepository {
    /**
     * Retrieves all products.
     * @returns {Promise<Array>} Array of product objects.
     */
    static async getAllProducts() {
        return await ProductDAO.getAllProducts();
    }

    /**
     * Retrieves filtered products based on criteria.
     * @param {Object} filters - Filtering criteria.
     * @returns {Promise<Array>} Array of filtered products.
     */
    static async getFilteredProducts(filters) {
        return await ProductDAO.getAllProducts(filters);
    }

    /**
     * Retrieves a product by its ID.
     * @param {string} id - The ID of the product.
     * @returns {Promise<Object|null>} The product object or null if not found.
     */
    static async getProductById(id) {
        try {
            const product = await ProductDAO.getProductById(id);
            if (!product) {
                console.error(`❌ Producto con ID ${id} no encontrado en la base de datos.`);
                return null;
            }

            if (!product.title || !product.price) {
                console.warn(`⚠️ Producto con ID ${id} encontrado, pero le faltan datos:`, product);
            }

            console.log("✅ Producto obtenido correctamente:", product);
            return product;
        } catch (error) {
            console.error("❌ Error al obtener producto:", error);
            throw error;
        }
    }

    /**
     * Creates a new product.
     * @param {Object} productData - Data for the new product.
     * @returns {Promise<Object>} The newly created product.
     */
    static async createProduct(productData) {
        return await ProductDAO.createProduct(productData);
    }

    /**
     * Creates multiple products at once.
     * @param {Array<Object>} products - List of product data.
     * @returns {Promise<Array>} The newly created products.
     */
    static async createProducts(products) {
        return await ProductDAO.createProducts(products);
    }

    /**
     * Updates an existing product.
     * @param {string} id - The ID of the product to update.
     * @param {Object} productData - The update data.
     * @returns {Promise<Object>} The updated product.
     */
    static async updateProduct(id, productData) {
        return await ProductDAO.updateProduct(id, productData);
    }

    /**
     * Deletes a product by its ID.
     * @param {string} id - The ID of the product to delete.
     * @returns {Promise<Object>} The deleted product.
     */
    static async deleteProduct(id) {
        return await ProductDAO.deleteProduct(id);
    }
}

export default ProductRepository;
