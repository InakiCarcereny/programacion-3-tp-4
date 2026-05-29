const fs = require("fs").promises;

const getAlumnoAll = async (req, res) => {
  try {
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);

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

    const legajoId = alumnos.find(
      (a) => a.legajo /* .toString() */ === Number(legajo)
    );

    if (!legajoId) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` });
    }

    return res.status(200).json(legajoId);
  } catch (error) {
    console.log(error);
    return res.status(500).JSON({
      error: "No se pudo obtener el datalle del alumno con legajo n° {legajo}",
    });
  }
};

/*const postAlumno = async (req, res) => {
  {
  const { nombre, apellido, email } = req.body;

  const data = await fs.readFile("./data/alumnos.json", "utf8");
  const alumnos = JSON.parse(data);

  console.log('Se pareseo infomracion a "alumnos"');
  const legajos = alumnos.map((alumno) => alumno.legajo);
  const newLegajo = Math.max(...legajos) + 1;
  console.log("Nuevo legajo generado");

   const nuevoAlumno = new AlumnoModel(nombre, apellido, email, nuevoLegajo);

    console.log(nuevoAlumno);
    const alumnoNuevo = nuevoAlumno.getAllAtributes();
    alumno.push(alumnoNuevo);
    console.log(nuevoAlumno.getAllAttributes());

    fs.writeFile(
      ".data/alumnos.json",
      JSON.stringify(alumnoNuevo, null, 2),
      "utf8"
    );
    return res.status(200).json({
      msg: `Se agrego al sistema el alumno nuevo con el legajo n: ${newLegajo}`,
      alumnoNuevo: alumnoNuevo,
    });
  } catch (error) {
    return res.status(500).json({
      error: `No se puedo dar de alta el nuevo alumno`,
    });
  } 
};*/

module.exports = { getAlumnoAll, getAlumnoById /*postAlumno*/ };
