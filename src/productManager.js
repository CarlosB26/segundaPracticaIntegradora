import fs from 'fs'; // Importa el módulo 'fs' para trabajar con archivos en Node.js

function generateUniqueID() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Agrega un 0 al mes si es un solo dígito
    const day = date.getDate().toString().padStart(2, '0'); // Agrega un 0 al día si es un solo dígito
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    // Concatena todos los componentes de la fecha y otros valores para crear un ID único
    const uniqueID = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    return Number(uniqueID);
}


class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.path = filePath;
        this.loadProducts();
    }

    addProduct(product) {

        if (!product.title || !product.description || !product.price || !product.thumbnails || !product.code || !product.stock || !product.category || !product.status) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const newProduct = {
            id: generateUniqueID(), // Asignar un ID único al nuevo producto
            ...product
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProducts() {
        this.loadProducts();
        return this.products;
    }

    getProductById(id) {
        this.loadProducts();

        const product = this.products.find((p) => p.id === id);
        if (!product) {
            // Manejar el error y enviar una respuesta al cliente
            return null;
        }
        return product;
    }

    getProductByCode(code) {
        this.loadProducts();

        const product = this.products.find((p) => p.code === code);
        if (!product) {
            // Manejar el error y enviar una respuesta al cliente
            return null;
        }
        return product;
      }

    updateProduct(id, updatedProduct) {
        this.loadProducts();

        const index = this.products.findIndex((p) => p.id === id);

        if (index === -1) {
            console.error("Producto no encontrado");
            return false;
        }

        this.products[index] = {
            ...this.products[index],
            ...updatedProduct,
            id: id,
        };

        this.saveProducts();
        return true;
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar los productos en el archivo JSON:", error);
        }
    }

    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            this.loadProducts();
            console.log("Productos:", this.products);
            console.log(typeof(this.products.id))
            console.log(typeof(id));

            const index = this.products.findIndex((p) => p.id === id);
            console.log("Índice:", index);

            if (index === -1) {
              reject("Producto no encontrado");
              return;
            }

            this.products.splice(index, 1);
            this.saveProducts();

            resolve();
          });

    }
}


const manager = new ProductManager('productos.json');


export default ProductManager;