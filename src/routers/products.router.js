import express  from 'express';
const router = express.Router();
import ProductManager from '../productManager.js';

const manager = new ProductManager('productos.json');



router.get('/', async (req, res) => {
    try {
        await manager.loadProducts();
        const products = manager.getProducts();

        const limit = parseInt(req.query.limit);

        if (isNaN(limit) || limit <= 0) {
            res.json(products);
        } else {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        await manager.loadProducts();
        const product = manager.getProductById(productId);

        if (product !== null) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar productos' });
    }
});


router.post('/', async (req, res) => {
    try {
        await manager.loadProducts();

        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails.' });
        }

        // Verifica si ya existe un producto con el mismo código
        const existingProduct = manager.getProductByCode(code);

        if (existingProduct) {
            return res.status(409).json({ error: 'Ya existe un producto con el mismo código.' });
        }

        // Crea un nuevo producto
        const newProduct = {
            title,
            description,
            code,
            price,
            status: true, // Status es true por defecto
            stock,
            category,
            thumbnails: thumbnails || [], // Si no se proporciona, se usa un array vacío
        };

        // Agrega el producto al administrador
        manager.addProduct(newProduct);

        // Guarda los productos en el archivo
        await manager.saveProducts();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error); // Agregar esta línea para mostrar detalles del error en la consola
        res.status(500).json({ error: 'Error al agregar el producto', details: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProductData = req.body;

        await manager.loadProducts();

        const index = manager.products.findIndex((p) => p.id === productId);

        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Asegúrate de que el ID del producto no se modifique en la actualización
        updatedProductData.id = productId;

        manager.products[index] = { ...manager.products[index], ...updatedProductData };

        manager.saveProducts();
        res.json(manager.products[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);

      await manager.loadProducts();

      const index = manager.products.findIndex((p) => p.id === productId);

      if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      manager.products.splice(index, 1);
      manager.saveProducts();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  });


export default router;