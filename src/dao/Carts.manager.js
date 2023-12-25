import CartModel from "../dao/models/cart.model.js";

export default class CartsdbManager {
  static get() {
    return CartModel.find();
  }

  static async getById(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      console.error("Carrito no encontrado");
      return;
    }
    return cart;
  }

  static async create(data) {
    const cart = await CartModel.create({
      products: data.products.map((product) => {
        return {
          product: product.product,
          quantity: product.quantity,
        };
      }),
    });
    console.log(`Carrito Creado Correctamente (${cart._id}) `);
    return cart;
  }

  static async updateById(cid, data) {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      throw new Error("No se encontró el carrito");
    }
    await CartModel.updateOne({ _id: cid }, { $set: data });
    console.log(`Carrito actualizado correctamente (${cid}) 😃`);
  }

  static async deleteById(cid) {
    try {
      // buscar
      const cart = await CartModel.findById(cid);

      // checkear
      if (!cart) {
        throw new Error(`No se encontró el carrito con ID: ${cid}`);
      }

      // borrar
      await CartModel.deleteOne({ _id: cid });

      console.log(`Se eliminó el carrito con ID: ${JSON.stringify(cid)} `);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el carrito");
    }
  }
}
