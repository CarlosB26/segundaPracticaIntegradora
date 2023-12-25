import { Router } from "express";
import CartsdbManager from "../../dao/Carts.manager.js";
import ProductsdbManager from "../../dao/Products.manager.js";
import CartModel from "../../dao/models/cart.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const { body } = req;
  const cart = await CartModel.create(body);
  res.status(201).json(cart);
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Delete the specific product from the cart
    const cart = await CartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { product: pid } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Product deleted from cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    // Verifica si el carrito existe
    const existingCart = await CartModel.findById(cid);

    if (!existingCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Actualiza los productos del carrito
    existingCart.products = products;

    // Guarda los cambios en la base de datos
    const updatedCart = await existingCart.save();

    res
      .status(200)
      .json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//modifica la cantidad
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Update the quantity of the specific product
    const cart = await CartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart or product not found" });
    }

    res.status(200).json({ message: "Product quantity updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//borra los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Delete all products from the cart
    const cart = await CartModel.findOneAndUpdate(
      { _id: cid },
      { $set: { products: [] } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Get the cart by ID
    const cart = await CartModel.findById(cid).select({ products: 1 });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Populate the products
    await cart.populate('products.product');

    // Only return the products array
    const products = cart.products;

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
