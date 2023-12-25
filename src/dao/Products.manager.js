import ProductModel from '../dao/models/product.model.js'

export default class ProductsdbManager{
    static get(){
        return ProductModel.find()    
    }

    static async getById(pid){
        const product = await ProductModel.findById(pid);
        if (!product) {
            console.error('Producto no encontrado');
            return;
        }
        return product;
    }

    static async create(data){
       
        const product = await ProductModel.create(data); 
        console.log(`Producto Creado Correctamente (${product._id}) 😃`)
        return product;
    }

    static async updateById(pid, data){
        const product = await ProductsdbManager.getById(pid); 
        if (!product) {
            throw new Error("No se encontró el producto");
          }
          await ProductModel.updateOne({ _id: pid}, { $set: data });
          console.log(`Producto actualizado correctamente (${pid}) 😃`)
    }

    static async deleteById(pid){
        const product = await ProductsdbManager.getById(pid); 
        if (!product) {
          throw new Error("No se encontró el producto");
        }
        await ProductModel.deleteOne({ _id: pid});
        console.log(`Se elimino el producto (${pid}) 😃`)
      }
}