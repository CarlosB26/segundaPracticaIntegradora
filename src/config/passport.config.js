import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from 'passport-github2'
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

export const init = () => {
  const registerOpts = {
    userNameField: "email",
    passReqToCallback: true,
  };

  passport.use(
    "register",
    new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (req, email, password, done) => {
      const { first_name, last_name, age } = req.body;
  
      if (!first_name || !last_name) {
        return done(null, false, { message: "Todos los campos son requeridos" });
      }
  
      try {
        const user = await UserModel.findOne({ email });
  
        if (user) {
          return done(null, false, { message: `Ya existe un usuario con el correo ${email} en el sistema` });
        }
  
        const newUser = await UserModel.create({
          first_name,
          last_name,
          email,
          password: createHash(password),
          age,
        });
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(new Error("Correo o contraseña inválidos.")); 
        }

        const isValid = isValidPassword(password, user);
        if (!isValid) {
          return done(new Error("Correo o contraseña inválidos."));
        }
         return done(null, user);
      }
    )
  );

  const githubOpts = {
    clientID: 'Iv1.3fcb337ad9a3685d',
    clientSecret: '894170a717969301bde2911eee94ea42046bd318',
    callbackURL: 'http://localhost:8080/api/sessions/github/callback'
  };

  passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {
    const email = profile._json.email;
    let user = await UserModel.findOne({ email });
    if(user){
      return done(null, user)
    }
    user = {
      first_name: profile._json.name,
      last_name: '',
      email,
      password:'',
      age: 18,
    }
    const newUser = await UserModel.create(user);
    done(null, newUser);
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await UserModel.findById(uid);
    done(null, user);
  });
};
