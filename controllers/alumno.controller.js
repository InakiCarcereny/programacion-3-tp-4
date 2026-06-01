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

    console.log('Se pareseo infomracion a "alumnos"');

    const legajos = alumnos.map((alumno) => alumno.legajo);

    const newLegajo = Math.max(...legajos) + 1;

    console.log("Nuevo legajo generado");

    const nuevoAlumno = new AlumnoModel(newLegajo, nombre, apellido, email);

    console.log(nuevoAlumno);

    const alumnoNuevo = nuevoAlumno.getAllAttributes();

    alumnos.push(alumnoNuevo);

    console.log(nuevoAlumno.getAllAttributes());

    await fs.writeFile(
      "./data/alumnos.json",

      JSON.stringify(alumnos, null, 2),

      "utf8"
    );

    return res.status(200).json({
      msg: `Se agrego al sistema el alumno nuevo con el legajo n: ${newLegajo}`,

      alumnoNuevo: alumnoNuevo,
    });
  } catch (error) {
    console.log("Error real:", error);

    return res.status(500).json({
      error: `No se puedo dar de alta el nuevo alumno`,
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

module.exports = { getAlumnoAll, getAlumnoById, postAlumno, deleteAlumnoById };
