import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    console.log("user", req.user);

    res.redirect("/profile");
  }
);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

router.post("/recoveryPassword", async (req, res) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    return res.render("error", {
      title: "error",
      messageError: "Todos los campos son requeridos",
    });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.render("error", {
      title: "error",
      messageError: "Correo o contraseña inválidos",
    });
  }
  user.password = createHash(password);
  await UserModel.updateOne({ email }, user);
  res.redirect("/login");
});

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No estas autenticado." });
  }
  res.status(200).json(req.session.user);
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.render("error", {
        title: "Bienvenido✋",
        messageError: error.message,
      });
    }
    res.redirect("/login");
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("user", req.user);
    res.redirect("/profile");
  }
);

export default router;
