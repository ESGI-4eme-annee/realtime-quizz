// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../db").User;
const generateToken = require("../utils/generateToken");
require("dotenv").config({ path: ".env", override: true });

async function signup(req, res) {
  try {
    if (!req.body?.email || !req.body?.password || !req.body?.name) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    if (!/\S+@\S+\.\S+/.test(req.body.email)) {
      return res
        .status(400)
        .json({
          error: "L'adresse e-mail est invalide.",
        });
    }

    if (req.body.password.length > 32) {
      return res
        .status(400)
        .json({
          error: "Le mot de passe doit contenir entre 8 et 32 caractères.",
        });
    }

    const usertest = await User.findOne({
      where: { email: req.body.email },
    });

    if (usertest) {
      return res.status(400).json({ error: "Adresse mail incorrecte" });
    }

    const apiToken = generateToken(32);
    const hashedPassword =req.body.password;
    const user = User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      api_token: apiToken,
    });

    res.status(201).json({
      message: "Utilisateur créé !",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function signupAdmin(req, res) {
  try {
    if (!req.body?.email || !req.body?.password || !req.body?.name) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    if (!/\S+@\S+\.\S+/.test(req.body.email)) {
      return res
        .status(400)
        .json({
          error: "L'adresse e-mail est invalide.",
        });
    }

    if (req.body.password.length > 32) {
      return res
        .status(400)
        .json({
          error: "Le mot de passe doit contenir entre 8 et 32 caractères.",
        });
    }

    const usertest = await User.findOne({
      where: { email: req.body.email },
    });

    if (usertest) {
      return res.status(400).json({ error: "Adresse mail incorrecte" });
    }

    const apiToken = generateToken(32);
    const hashedPassword =req.body.password;
    const user = User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      api_token: apiToken,
      role: "admin",
    });

    res.status(201).json({
      message: "Utilisateur créé !",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    if (!req.body?.email || !req.body?.password) {
      return res.status(400).json({ error: "Email ou mot de pass manquant" });
    }
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Email ou Mot de passe incorrect !" });
    }

    if (user.is_verified === false) {
      return res
        .status(401)
        .json({ error: "Votre compte doit être validé par un administrateur" });
    }

    const validPassword = req.body.password == user.password;

    if (!validPassword) {
      return res
        .status(401)
        .json({ error: "Email ou Mot de passe incorrect !" });
    }

    const token = jwt.sign(
      {
        userToken: user.api_token,
        userEmail: user.email,
        userRole: user.role,
        userId: user.id,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: false,
      sameSite: false,
      signed: false,
    });

    res.status(200).json({
      userId: user.id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUser(req, res) {
  User.findAll()
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(400).json({ error }));
}

function getConnectedUser(req, res) {
  const token = req.cookies.token;
  console.log("token", token)

  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userEmail = decoded.userEmail;

    // Rechercher l'utilisateur correspondant à l'ID
    User.findOne({ where: { email: userEmail } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Renvoyer les informations de l'utilisateur connecté
        res.status(200).json({
          userId: user.id,
          email: user.email,
          name: user.name,
          apiToken: user.api_token,
          // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

function getConnectedUserNav(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userEmail = decoded.userEmail;

    // Rechercher l'utilisateur correspondant à l'ID
    User.findOne({ where: { email: userEmail } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Renvoyer les informations de l'utilisateur connecté
        res.status(200).json({
          userId: user.id,
          email: user.email,
          apiToken: user.api_token,
          role: user.role,
          // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  signup,
  login,
  getUser,
  getConnectedUser,
  logout,
  getConnectedUserNav,
  signupAdmin,

};
