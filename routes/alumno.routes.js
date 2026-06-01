const { Router } = require("express");

const {
  validatePostAlumno,
} = require("../middlewares/alumno-validator.middleware.js");

const {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
  deleteAlumnoById,
} = require("../controllers/alumno.controller");

const rutas = Router();

rutas.get("/", getAlumnoAll);
rutas.get("/:legajo", getAlumnoById);
rutas.post("/", validatePostAlumno, postAlumno);
rutas.delete("/:legajo", deleteAlumnoById);

module.exports = rutas;
