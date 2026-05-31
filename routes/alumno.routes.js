const { Router } = require("express");
const {
  getAlumnoAll,
  getAlumnoById,
  updateAlumno,
} = require("../controllers/alumno.controller");

const rutas = Router();


rutas.get("/", getAlumnoAll);
rutas.get("/:legajo", getAlumnoById);
rutas.put("/:legajo", updateAlumno);

module.exports = rutas;


