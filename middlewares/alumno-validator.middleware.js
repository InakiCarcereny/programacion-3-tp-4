const regexLetras = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;

const validatePostAlumno = (req, res, next) => {
  const { nombre, apellido, email } = req.body;
  const errors = [];

  if (
    !nombre ||
    typeof nombre !== "string" ||
    !regexLetras.test(nombre.trim())
  ) {
    errors.push("El nombre es obligatorio y debe contener solo letras.");
  }

  if (
    !apellido ||
    typeof apellido !== "string" ||
    !regexLetras.test(apellido.trim())
  ) {
    errors.push("El apellido es obligatorio y debe contener solo letras.");
  }

  if (
    !email ||
    typeof email !== "string" ||
    !email.endsWith("@facultad.edu.ar")
  ) {
    errors.push(
      "El email es obligatorio y debe terminar con '@facultad.edu.ar'."
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validatePutAlumno = (req, res, next) => {
  const { nombre, apellido, email, isActive, legajo, fechaAlta } = req.body;
  const errors = [];

  if (
    nombre !== undefined &&
    (typeof nombre !== "string" || !regexLetras.test(nombre.trim()))
  ) {
    errors.push("El nombre debe contener solo letras.");
  }

  if (
    apellido !== undefined &&
    (typeof apellido !== "string" || !regexLetras.test(apellido.trim()))
  ) {
    errors.push("El apellido debe contener solo letras.");
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || !email.endsWith("@facultad.edu.ar"))
  ) {
    errors.push("El email debe terminar con '@facultad.edu.ar'.");
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push("isActive debe ser un booleano.");
  }

  if (legajo !== undefined) {
    errors.push("El campo 'legajo' no puede ser modificado.");
  }

  if (fechaAlta !== undefined) {
    errors.push("El campo 'fechaAlta' no puede ser modificado.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validatePostAlumno, validatePutAlumno };
