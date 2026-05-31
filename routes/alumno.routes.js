const { Router } = require("express");
const {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
} = require("../controllers/alumno.controller");

const rutas = Router();

rutas.get("/", getAlumnoAll);
rutas.get("/:legajo", getAlumnoById);
rutas.post("/", postAlumno);

module.exports = rutas;
