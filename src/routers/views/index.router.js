import { Router } from "express";
import ProductsdbManager from "../../dao/Products.manager.js";
import ProductModel from "../../dao/models/product.model.js";
import CartModel from "../../dao/models/cart.model.js";
import { buildResponsePaginated } from "../../utils.js";


const router = Router();


router.get("/", async (req, res) => {
  if(!req.user){
    return res.redirect('/login')
  }
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
  const data = buildResponsePaginated(
    products,
    sort || null,
    search || null,
    "http://localhost:8080"
  );
  res.render("dbproducts", { title: "Api Productos", ...data, user: req.user.toJSON()});
});

router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Obtener el carrito por ID y populando los productos de forma explícita
    const cart = await CartModel.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Convertir cart a un objeto simple para asegurar propiedades propias
    const cartData = cart.toObject();

    // Renderizar la plantilla con los datos del carrito reestructurados
    res.render("carrito", { cart: cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// router.post("/api/cookie", (req, res) => {
//   const {
//     body: { fullname, email },
//   } = req;
//   console.log("fullname, email", fullname, email);

//   res.cookie("fullname", fullname).cookie("email", email).redirect("http://localhost:8080/");
// });

// router.get("/api/cookie", (req, res) => {
//   const cookies = req.cookies;
//   res
//     .status(200)
//     .json(cookies);
// });




export default router;
