import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// stockage en mémoire (reset si le serveur redémarre)
let notes = [];

// check rapide du token (si l'utilisatuer est connecté)
const checkAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "no token" });

  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "invalid token" });
    req.user = user;
    next();
  });
};

// récupérer les notes de l'utilisateur connecté
router.get("/", checkAuth, (req, res) => {
  res.json(notes.filter(n => n.owner === req.user.email));
});

// créer une nouvelle note
router.post("/", checkAuth, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "empty note" });

  const note = { id: Date.now(), owner: req.user.email, content };
  notes.push(note);
  res.json(note);
});

// modifier une note
router.put("/:id", checkAuth, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const idx = notes.findIndex(n => n.id == id && n.owner === req.user.email);
  if (idx === -1) return res.status(404).json({ error: "not found" });

  notes[idx].content = content || notes[idx].content;
  res.json(notes[idx]);
});

// supprimer une note
router.delete("/:id", checkAuth, (req, res) => {
  const { id } = req.params;
  const before = notes.length;
  notes = notes.filter(n => !(n.id == id && n.owner === req.user.email));

  if (notes.length === before) return res.status(404).json({ error: "not found" });
  res.json({ ok: true });
});

export default router;
