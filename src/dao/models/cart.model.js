import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
}, {_id: false});

const CartSchema = new mongoose.Schema({
  products: {
    type: [productItemSchema],
    default: [],
  },
})

CartSchema.pre('find', function(){
    this.populate('products.product')
})

CartSchema.plugin(mongoosePaginate);

export default mongoose.model("cart", CartSchema);