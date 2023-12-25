import mongoose from "mongoose";
export const URI ='mongodb+srv://developer:5ZXynnb88OS0FN86@cluster0.yox1dkl.mongodb.net/eccomerce';

export const initDb = async () => {
    try{
        await mongoose.connect(URI);
        console.log('Base de datos conectada 🚀');
    } catch(error){
        console.error('ocurrio un error al intentar conectarse a la base de datos')
    }
}