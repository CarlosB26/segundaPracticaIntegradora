import { Router }  from 'express';


const router = Router();

router.get('/', (req, res) => {     
   if(!req.user){
     return res.redirect('/login')
   }
    res.redirect('/dbproducts');
 });

router.get('/profile', (req, res) => {     
  if(!req.user){
    return res.redirect('/login');
  }
   res.redirect('/dbproducts');
});

router.get('/login', (req, res) => {     
   res.render('login', {title: 'Login'});
});

router.get('/register', (req, res) => {     
   res.render('register', {title: 'Registro'});
});

router.get('/recoveryPassword', (req, res) => {
   res.render('recoveryPassword', {title: 'Recuperar contraseña', })
})


export default router;