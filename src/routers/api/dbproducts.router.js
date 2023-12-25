import { Router } from 'express';
import ProductsdbManager from '../../dao/Products.manager.js';
import ProductModel from "../../dao/models/product.model.js";
import { buildResponsePaginated } from '../../utils.js';


const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, search } = req.query;
  //sort esta asociado a price
  //search esta asociado a category
  const criteria = {};
  const options = { limit, page };
  if (sort) {
    options.sort = { price: sort };
  }
  if (search) {
    criteria.category = search;
  }
  const products = await ProductModel.paginate(criteria, options);
  res.status(200).json(buildResponsePaginated(products, sort || null, search || null));
});




router.get('/productos/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await ProductsdbManager.getById(pid);
    res.status(200).json(product) ;
})

router.post('/productos', async (req, res) => {
    const { body } = req;
    const product = await ProductsdbManager.create(body);
    res.status(201).json(product) ;
});

router.put('/productos/:pid', async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    await ProductsdbManager.updateById(pid, body);
    res.status(204).end();
});

router.delete('/productos/:pid', async (req, res) => {
    const { pid } = req.params;
    await ProductsdbManager.deleteById(pid);
    res.status(204).end();
});

export default router;