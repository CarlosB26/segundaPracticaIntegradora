import { Server } from 'socket.io';

import ProductManager from './productManager.js'

let io;

export const init = (httpServer) => {
    io = new Server(httpServer);

    io.on('connection', async (socketClient) => {
        const manager = new ProductManager('productos.json');
        const productList = await manager.getProducts();
        console.log(`nuevo cliente conectado ${socketClient.id}`)
        emit('List', productList);
        console.log(productList)
        socketClient.on('product-add', async (newProduct) => {
            try {
                console.log(`Cliente envio un mensaje llego :`, newProduct)
                await manager.addProduct(newProduct)
                const productList = await manager.getProducts();
                console.log("producto agregado")
                emit('List', productList, console.log("Nueva lista"));
            } catch (error) {
                console.error('Error al añadir el producto', error);

            }
        })
        socketClient.on('product-delete', async (id) => {
            try {
                console.log(`Cliente envio un mensaje llego para borrar:`, id)
                await manager.deleteProduct(parseInt(id));
                const productList = await manager.getProducts();
                console.log("producto borrado")
                emit('List', productList, console.log("Nueva lista"));
            } catch (error) {
                console.error('Error al añadir el producto', error);

            }
        })
    });
};


export const emit = (event, data) => {
    io.emit(event, data);
}


