import fs  from 'fs';

import express  from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  const cartId = uuidv4(); // Genera un ID único para el carrito
  const newCart = { id: cartId, products: [] };

  // Guarda el carrito en "carrito.json"
  const carts = loadCarts();
  carts[cartId] = newCart;
  saveCarts(carts);

  res.status(201).json(newCart);
});

// Ruta para listar los productos de un carrito específico
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const carts = loadCarts();

  if (carts[cartId]) {
    res.json(carts[cartId].products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1; // Por defecto, se agrega uno
  const carts = loadCarts();

  if (!carts[cartId]) {
    res.status(404).json({ message: 'Carrito no encontrado' });
    return;
  }

  // Verifica si el producto ya existe en el carrito
  const existingProduct = carts[cartId].products.find((product) => product.product === productId);

  if (existingProduct) {
    // Si el producto ya existe, incrementa la cantidad
    existingProduct.quantity += quantity;
  } else {
    // Si el producto no existe, agrégalo al carrito
    carts[cartId].products.push({ product: productId, quantity });
  }

  // Guarda el carrito actualizado en "carrito.json"
  saveCarts(carts);

  res.json(carts[cartId].products);
});

// Función para cargar los carritos desde "carrito.json"
function loadCarts() {
  try {
    const data = fs.readFileSync('carrito.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Función para guardar los carritos en "carrito.json"
function saveCarts(carts) {
  try {
    fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error('Error al guardar carritos en el archivo JSON:', error);
  }
}

export default router;