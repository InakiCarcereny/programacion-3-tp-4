const { Router } = require("express");

const {
  validatePostAlumno,
  validatePutAlumno,
} = require("../middlewares/alumno-validator.middleware.js");

const {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
  deleteAlumnoById,
  updateAlumno,
} = require("../controllers/alumno.controller");

const rutas = Router();

rutas.get("/", getAlumnoAll);
rutas.get("/:legajo", getAlumnoById);
rutas.post("/", validatePostAlumno, postAlumno);
rutas.delete("/:legajo", deleteAlumnoById);
rutas.put("/:legajo", validatePutAlumno, updateAlumno);

module.exports = rutas;
