import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../database.js";

const router = express.Router();

// Middleware d'authentification
const checkAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user;
    next();
  });
};

// Récupérer toutes les notes de l'utilisateur
router.get("/", checkAuth, (req, res) => {
  db.all(
    'SELECT id, content, created_at, updated_at FROM notes WHERE user_email = ? ORDER BY updated_at DESC',
    [req.user.email],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de la récupération des notes" });
      }
      res.json(rows);
    }
  );
});

// Créer une nouvelle note
router.post("/", checkAuth, (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: "Le contenu de la note est requis" });
  }

  db.run(
    'INSERT INTO notes (user_email, content) VALUES (?, ?)',
    [req.user.email, content],
    function(err) {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de la création de la note" });
      }
      
      // Récupérer la note créée
      db.get(
        'SELECT id, content, created_at, updated_at FROM notes WHERE id = ?',
        [this.lastID],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération de la note" });
          }
          res.json(row);
        }
      );
    }
  );
});

// Modifier une note existante
router.put("/:id", checkAuth, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Le contenu de la note est requis" });
  }

  db.run(
    'UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_email = ?',
    [content, id, req.user.email],
    function(err) {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de la modification de la note" });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: "Note non trouvée" });
      }
      
      // Récupérer la note modifiée
      db.get(
        'SELECT id, content, created_at, updated_at FROM notes WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération de la note" });
          }
          res.json(row);
        }
      );
    }
  );
});

// Supprimer une note
router.delete("/:id", checkAuth, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM notes WHERE id = ? AND user_email = ?',
    [id, req.user.email],
    function(err) {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de la suppression de la note" });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: "Note non trouvée" });
      }
      
      res.json({ message: "Note supprimée avec succès" });
    }
  );
});

export default router;
