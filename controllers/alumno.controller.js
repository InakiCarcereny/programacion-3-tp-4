const fs = require("fs").promises;

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

    alumnos[indiceAlumno] = {
      ...alumnoActual,
      ...req.body,
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

module.exports = { getAlumnoAll, getAlumnoById, updateAlumno };
