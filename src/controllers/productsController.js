import ProductDTO from '../dtos/ProductDTO.js';
import ProductRepository from '../dao/repositories/ProductRepository.js';

// Función auxiliar para obtener los productos con filtros y paginación
const getFilteredProducts = async ({ limit, page, sort, query }) => {
    const filter = query ? { category: query } : {};
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const limitNum = parseInt(limit, 10) || 10;
    const pageNum = parseInt(page, 10) || 1;

    const products = await ProductRepository.getFilteredProducts({ filter, sortOption, limitNum, pageNum });

    const totalProducts = await ProductRepository.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    return { products, totalPages, pageNum, limitNum };
};

export const getCatalog = async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    res.render('realTimeProducts', { limit, page, sort, query });
};

// Obtener productos con paginación, filtros y ordenamiento
export const getProducts = async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const { products, totalPages, pageNum } = await getFilteredProducts({ limit, page, sort, query });

        const productDTOs = products.map(product => new ProductDTO(product)); // ✅ Convertir a DTO

        res.json({
            status: "success",
            payload: productDTOs,
            totalPages,
            prevPage: pageNum > 1 ? pageNum - 1 : null,
            nextPage: pageNum < totalPages ? pageNum + 1 : null,
            page: pageNum,
            hasPrevPage: pageNum > 1,
            hasNextPage: pageNum < totalPages,
            prevLink: pageNum > 1 ? `/api/products?limit=${limit}&page=${pageNum - 1}&sort=${sort}&query=${query}` : null,
            nextLink: pageNum < totalPages ? `/api/products?limit=${limit}&page=${pageNum + 1}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        console.error("❌ Error obteniendo productos:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// Obtener un producto por su ID y renderizar la vista de detalles
export const getProductById = async (req, res) => {
    try {
        const product = await ProductRepository.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(new ProductDTO(product)); // ✅ Convertimos a DTO antes de responder
    } catch (error) {
        console.error("❌ Error obteniendo producto:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// Agregar un nuevo producto
export const addProduct = async (req, res) => {
    try {
        const newProduct = await ProductRepository.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el producto' });
    }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await ProductRepository.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await ProductRepository.deleteProduct(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

// Generar 20 productos de prueba
export const generateTestProducts = async (req, res) => {
    try {
        const testProducts = Array.from({ length: 20 }, (_, i) => ({
            title: `Producto ${i + 1}`,
            description: `Descripción del Producto ${i + 1}`,
            code: `CODE${i + 1}`,
            price: Math.floor(Math.random() * 1000) + 1,
            status: true,
            stock: Math.floor(Math.random() * 100) + 1,
            category: `Categoría ${['A', 'B', 'C'][i % 3]}`,
            thumbnails: []
        }));

        await ProductRepository.insertMany(testProducts);
        res.json({ message: "20 productos de prueba generados exitosamente" });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar productos de prueba' });
    }
};

export const deleteAllProducts = async (req, res) => {
    try {
        await ProductRepository.deleteAllProducts();
        res.json({ message: "Todos los productos fueron eliminados exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar todos los productos" });
    }
};

// Renderiza la vista de catálogo para los usuarios
export const renderCatalog = async (req, res) => {
    try {
        const products = await ProductRepository.getAllProducts();
        const cartId = req.user ? req.user.cart : null; // Asegurarse de pasar el cartId del usuario autenticado

        res.render('catalog', { products, cartId });
    } catch (error) {
        console.error("Error renderizando catálogo:", error);
        res.status(500).send("Error interno del servidor");
    }
};
