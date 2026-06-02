const fs = require("fs").promises;
const { AlumnoModel } = require("../models/alumno.model");

const getAlumnoAll = async (req, res) => {
  try {
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    let alumnos = JSON.parse(data);

    const { apellido, isActive } = req.query;

    if (apellido) {
      alumnos = alumnos.filter((a) =>
        a.apellido.toLowerCase().includes(apellido.toLowerCase())
      );
    }

    if (isActive !== undefined) {
      const activo = isActive === "true";
      alumnos = alumnos.filter((a) => a.isActive === activo);
    }

    return res.status(200).json(alumnos);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: "No se puedieron obtener los datos de los alumnos" });
  }
};

const getAlumnoById = async (req, res) => {
  try {
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);

    const { legajo } = req.params;

    const legajoId = alumnos.find((a) => a.legajo === Number(legajo));

    if (!legajoId) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` });
    }

    return res.status(200).json(legajoId);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: `No se pudo obtener el detalle del alumno con ese legajo`,
    });
  }
};

const postAlumno = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);

    const emailExiste = alumnos.some((a) => a.email === email);
    if (emailExiste) {
      return res.status(409).json({
        error: `Ya existe un alumno registrado con el email ${email}.`,
      });
    }

    const legajos = alumnos.map((alumno) => alumno.legajo);
    const newLegajo = Math.max(...legajos) + 1;

    let nuevoAlumno;
    try {
      nuevoAlumno = new AlumnoModel(newLegajo, nombre, apellido, email);
    } catch (validationError) {
      return res.status(400).json({
        error: validationError.message,
      });
    }

    const alumnoNuevo = nuevoAlumno.getAllAttributes();
    alumnos.push(alumnoNuevo);

    await fs.writeFile(
      "./data/alumnos.json",
      JSON.stringify(alumnos, null, 2),
      "utf8"
    );

    return res.status(201).json({
      msg: `Se agregó al sistema el alumno nuevo con el legajo n°: ${newLegajo}`,
      alumnoNuevo,
    });
  } catch (error) {
    console.log("Error real:", error);
    return res.status(500).json({
      error: "No se pudo dar de alta el nuevo alumno.",
    });
  }
};

const deleteAlumnoById = async (req, res) => {
  const { legajo } = req.params;
  try {
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);

    const index = alumnos.findIndex((a) => a.legajo === Number(legajo));

    if (index === -1) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` });
    }

    const alumnoEliminado = alumnos[index];

    alumnos.splice(index, 1);

    await fs.writeFile(
      "./data/alumnos.json",
      JSON.stringify(alumnos, null, 2),
      "utf8"
    );

    console.log(`Alumno con legajo ${legajo} eliminado`);

    return res.status(200).json({
      msg: `Se eliminó correctamente el alumno con legajo ${legajo}`,
      alumnoEliminado: alumnoEliminado,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: `No se pudo eliminar el alumno con legajo ${legajo}`,
    });
  }
};

const updateAlumno = async (req, res) => {
  try {
    const { legajo } = req.params;
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);
    const indiceAlumno = alumnos.findIndex((a) => a.legajo === Number(legajo));

    if (indiceAlumno === -1) {
      return res.status(404).json({
        msg: `No existe el alumno con legajo ${legajo}`,
      });
    }

    const alumnoActual = alumnos[indiceAlumno];
    const { nombre, apellido, email, isActive } = req.body;

    const actualizacion = Object.fromEntries(
      Object.entries({ nombre, apellido, email, isActive }).filter(
        ([_, v]) => v !== undefined
      )
    );

    alumnos[indiceAlumno] = {
      ...alumnoActual,
      ...actualizacion,
      legajo: alumnoActual.legajo,
      modificacion: new Date().toISOString().split("T")[0],
    };

    await fs.writeFile("./data/alumnos.json", JSON.stringify(alumnos, null, 2));
    return res.status(200).json(alumnos[indiceAlumno]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "No se pudo actualizar",
    });
  }
};

module.exports = {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
  deleteAlumnoById,
  updateAlumno,
};
