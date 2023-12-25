import  express from 'express' ;
import path from 'path';
import handlebars from 'express-handlebars';
import sessions from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import {URI} from './db/mongodb.js'
import { init as initPassport } from './config/passport.config.js'
//import cookieParser from 'cookie-parser'

import productRoutes  from './routers/products.router.js';
import homeRoutes  from './routers/home.router.js';
import cartRoutes  from './routers/api/dbcarts.router.js';
import realTime  from './routers/realTimeProducts.router.js';
import sessionsRouter from './routers/sessions.router.js'
import indexRoutes from './routers/views/index.router.js'
import productApiRouter from './routers/api/dbproducts.router.js'
import CartModel from '../src/dao/models/cart.model.js'


import { __dirname } from './utils.js';

const SESSION_SECRET = '1Uw?M^w4&P3h>C^28^Mx{5OmQ-CUqaff';

const app = express();



// Middleware para el análisis de JSON en las solicitudes
//app.use(cookieParser(COOKIE_SECRET));
app.use(sessions({
  store: MongoStore.create({
    mongoUrl: URI,
    mongoOptions:{},
    ttl:120,
  }),
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const hbs = handlebars.create({
  allowProtoMethodsByDefault: true,
});
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views')),
app.set('view engine', 'handlebars')

initPassport();
app.use(passport.initialize());
app.use(passport.session());

// Usa las rutas definidas en los archivos importados
app.use('/', homeRoutes);
app.use('/dbproducts', indexRoutes);
app.use('/api/dbproducts', productApiRouter);//dbproducts
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartRoutes); //carrito
app.use('/realtimeproducts', realTime);

app.use((error, req, res, next) => {
  const message = `Ocurrio un error desconocido 😔: ${error.message}`;
  console.error(message);
  res.status(500).json ({ message });
})

const test =  async() => 
{
  try{
  const cart = await CartModel.find({ _id: '65709eeddaec0726145e2c66'})
  console.log('carrito', JSON.stringify(cart, null, 2))
  }
catch(error){
  console.error("ocurrio algo", error.message)
}
};



export default app;

