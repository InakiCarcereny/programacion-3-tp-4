const { Router } = require("express");
const {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
  deleteAlumnoById
} = require("../controllers/alumno.controller");

const rutas = Router();

rutas.get("/", getAlumnoAll);
rutas.get("/:legajo", getAlumnoById);
rutas.post("/", postAlumno);
rutas.delete("/:legajo", deleteAlumnoById);

module.exports = rutas;
  