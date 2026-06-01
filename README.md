<div align="center">

# API REST

### API REST para la gestión de alumnos universitarios. 

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

## Integrantes - Grupo N-7

Iñaki Carcereny · Valentín De Pascale · Joaquín Marcilese · Ezequiel Barrionuevo · Alan Axel Hansen

</div>

---

## Descripción

API REST desarrollada con Node.js y Express para la gestión de alumnos universitarios. Permite realizar operaciones CRUD sobre un archivo JSON que simula una base de datos, exponiéndolas a través de endpoints documentados y desplegada en Render mediante Docker.

---

## Flujo y metodología de trabajo

| Rama | Descripción |
|------|-------------|
| `main` | Versión final de producción |
| `dev` | Integración de todas las features |
| `feature/*` | Nuevas funcionalidades |
| `docs/*` | Cambios en documentación |
| `fix/*` | Corrección de errores |

El proyecto siguió una metodología colaborativa basada en **Git Flow**, donde cada 
funcionalidad se desarrolló en ramas independientes con el prefijo `feature/`. Una vez 
verificado que la funcionalidad cumplía con los requerimientos, se abría un **Pull Request** 
hacia la rama `dev` para revisión del equipo antes de aprobar el merge. La entrega final 
se realizó mediante un merge a `main`.

La arquitectura del proyecto sigue el patrón **MVC**, separando la lógica en capas bien 
diferenciadas: las rutas en `/routes` delegan la lógica a los controladores en 
`/controllers`, los cuales acceden a los datos almacenados en archivos JSON dentro de 
`/data`. Los modelos en `/models` están escritos en **TypeScript** y definen las clases que 
representan las entidades del sistema. Las validaciones de los datos entrantes se 
realizan en la capa de **middlewares**, antes de que la request llegue al controlador.

El entorno de desarrollo se estandarizó mediante **ESLint** y **Prettier** para mantener 
consistencia en el estilo del código, **Husky** con **lint-staged** para validar el formato 
y los errores antes de cada commit, **commitlint** para estandarizar los mensajes de commit, y **EditorConfig** junto con una 
configuración compartida de VSCode para garantizar uniformidad entre todos los integrantes 
del equipo.

El deploy de la API se realizó en **Render** utilizando una imagen de **Docker**.

---

## Convención de commits

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `refactor:` | Reorganización de código |

---

## División de tareas

| Integrante | Tareas |
|------------|--------|
| **Iñaki** | Endpoint `GET /alumnos/:id`, filtro por query params (`apellido`, `isActive`), middlewares para `POST` y `PUT`, configuración del entorno (ESLint, Prettier, Husky, EditorConfig, VSCode), Dockerfile y despliegue en Render, documentación. |
| **Valentín** | Endpoint `POST /alumnos` y despliegue en Render. |
| **Alan** | Endpoint `PUT /alumnos/:id`. |
| **Ezequiel** | Endpoint `DELETE /alumnos/:id`. |
| **Joaquín** | Clase `Alumno` en `alumno.model.ts`. |

---

## Funcionalidades

| Feature | Descripción |
|---------|-------------|
| **Configuración del servidor** | El servidor se inicializa como una clase `Server` que registra middlewares, rutas y levanta la aplicación en el puerto definido por variable de entorno. |
| **Middlewares** | Se configuran CORS y parseo de JSON para las requests entrantes. Se aplican middlewares de validación antes de los endpoints `POST` y `PUT`. |
| **GET /alumnos** | Devuelve todos los alumnos almacenados en `alumnos.json`. Soporta filtrado opcional por `apellido` y `isActive` mediante query params. |
| **GET /alumnos/:id** | Busca y devuelve un alumno específico por su número de legajo. |
| **POST /alumnos** | Valida los datos recibidos en el body y crea un nuevo alumno en `alumnos.json`. |
| **PUT /alumnos/:id** | Modifica los datos de un alumno existente identificado por su legajo. No permite modificar el número de legajo. |
| **DELETE /alumnos/:id** | Elimina un alumno de `alumnos.json` a partir de su número de legajo. |
| **Modelo Alumno** | Clase `Alumno` escrita en TypeScript que define la estructura y tipos de datos de cada alumno. |

**`Server`**

**`constructor()`:** Al instanciar la clase, crea la aplicación Express, define el puerto desde la variable de entorno `PORT` con fallback a `3000`, y llama a `middleware()` y `routes()` para configurarlos al iniciar.

```js
constructor() {
  this.app = express();
  this.port = process.env.PORT || 3000;
  this.middleware();
  this.rutas();
}
```

**`middleware()`:** Registra dos middlewares globales. `cors()` permite que el frontend pueda hacer peticiones al backend desde un origen distinto. `express.json()` habilita el parseo automático del body en formato JSON para los requests POST. 

```js
middleware() {
  this.app.use(cors());
  this.app.use(express.json());
}
```

**`rutas()`:** Registra las rutas de la API delegando cada endpoint a su archivo de rutas correspondiente. Al final registra dos middlewares de manejo de errores: uno para 404 y otro para 500. Ambos reciben cuatro parámetros `(err, req, res, next)`, lo que le indica a Express que son manejadores de error.

```js
rutas() {
  this.app.use("/alumnos", require("../routes/alumno.routes"));
  this.app.use((err, req, res, _next) => {
    console.error(err.stack);
    return res.status(404).json({ msg: "Error. Pagina no encontrada" });
  });
  this.app.use((err, req, res, _next) => {
    console.error(err.stack);
    return res.status(500).json({ msg: "Internal Server Error" });
  });
}
```

**`listen()`:** Levanta el servidor en el puerto configurado y muestra un mensaje en consola confirmando que está escuchando.

```js
listen() {
  this.app.listen(this.port, () => {
    console.log(`La API esta escuchando el el puerto: ${this.port}`);
  });
}
```

**`app.js`:** Punto de entrada de la aplicación. Importa la clase `Server`, crea una instancia y llama a `listen()` para iniciar la API en el puerto configurado.
```js
const Server = require("./core/server");
const servidor = new Server();
servidor.listen();
```

**`alumno.routes.js`:** Define las rutas del recurso `/alumnos` usando `Router` de Express. Cada ruta delega la lógica a su controlador correspondiente. El endpoint `POST` incluye el middleware `validatePostAlumno` antes del controlador para validar los datos del body antes de procesarlos.

```js
const rutas = Router();
rutas.get("/", getAlumnoAll);
rutas.get("/:legajo", getAlumnoById);
rutas.post("/", validatePostAlumno, postAlumno);
rutas.put("/:legajo", validatePutAlumno, putAlumno);
rutas.delete("/:legajo", deleteAlumnoById);
```

**`regexLetras`:** Expresión regular que valida que un string contenga únicamente letras, incluyendo tildes, la ñ y espacios.
```js
const regexLetras = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
```

**`validatePostAlumno()`:** Middleware que valida los datos obligatorios antes de crear un alumno. Verifica que `nombre` y `apellido` sean strings con solo letras, y que `email` termine con `@facultad.edu.ar`. Si alguna validación falla, acumula los errores en un array y responde con `400`. Si todo es válido, llama a `next()` para continuar al controlador.

```js
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
```

**`validatePutAlumno()`:** Middleware que valida los datos antes de modificar un alumno. A diferencia del POST, todos los campos son opcionales, por lo que solo valida los que están presentes en el body. También bloquea cualquier intento de modificar `legajo` o `fechaAlta`, respondiendo con `400` si se detectan. Si todo es válido, llama a `next()`.

```js
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
```

**`getAlumnoAll()`:** Lee el archivo `alumnos.json` y devuelve la lista completa de alumnos. Soporta filtrado opcional mediante query params: si se recibe `apellido`, filtra los alumnos cuyo apellido contenga el valor ingresado (case insensitive); si se recibe `isActive`, filtra por estado activo o inactivo. Si no se envía ningún query param, devuelve todos. En caso de error responde con `500`.

```js
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
      .json({ error: "No se pudieron obtener los datos de los alumnos" });
  }
};
```

**`getAlumnoById()`:** Lee el archivo `alumnos.json` y busca un alumno cuyo `legajo` coincida con el parámetro recibido por URL. Convierte el parámetro a número antes de comparar ya que `req.params` devuelve strings. Si no encuentra ninguna coincidencia responde con `404`, si lo encuentra responde con `200` y los datos del alumno. En caso de error responde con `500`.

```js
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
```

**`postAlumno()`:** Crea un nuevo alumno a partir de los datos recibidos en el body (`nombre`, `apellido`, `email`). Lee `alumnos.json`, obtiene todos los legajos existentes y genera un nuevo legajo tomando el máximo y sumándole `1`. Instancia la clase `AlumnoModel` con los datos y el legajo generado, obtiene todos sus atributos con `getAllAttributes()`, lo agrega al array y sobreescribe el archivo. Responde con `200` y los datos del alumno creado. En caso de error responde con `500`.

```js
const postAlumno = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);
    console.log('Se parseó información a "alumnos"');
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
      msg: `Se agregó al sistema el alumno nuevo con el legajo n: ${newLegajo}`,
      alumnoNuevo: alumnoNuevo,
    });
  } catch (error) {
    console.log("Error real:", error);
    return res.status(500).json({
      error: `No se pudo dar de alta el nuevo alumno`,
    });
  }
};
```

**`deleteAlumnoById()`:** Elimina un alumno de `alumnos.json` a partir del `legajo` recibido por URL. Lee el archivo, busca el índice del alumno con `findIndex()` convirtiendo el parámetro a número. Si no lo encuentra responde con `404`. Si existe, guarda una referencia al alumno antes de eliminarlo con `splice()`, sobreescribe el archivo y responde con `200` devolviendo los datos del alumno eliminado. En caso de error responde con `500`.

```js
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
```

**`updateAlumno()`:** Modifica los datos de un alumno existente a partir del `legajo` recibido por URL. Lee `alumnos.json` y busca el índice del alumno con `findIndex()`. Si no existe responde con `404`. Si existe, extrae únicamente los campos permitidos del body (`nombre`, `apellido`, `email`, `isActive`) y construye un objeto de actualización filtrando los que sean `undefined`, evitando pisar campos no enviados. Fusiona el alumno actual con la actualización usando spread, forzando que `legajo` no se modifique y actualizando `modificacion` con la fecha actual. Sobreescribe el archivo y responde con `200` devolviendo el alumno actualizado. En caso de error responde con `500`.

```js
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
```

**`AlumnoModel`:** Clase TypeScript que extiende `PersonaModel` y representa la entidad alumno con sus atributos y validaciones.

- **Constructor**: recibe `legajo`, `nombre`, `apellido` y `email` como obligatorios, y `fechaAlta`, `modificacion` e `isActive` como opcionales. Llama a `super()` para inicializar los atributos de `PersonaModel`, valida el legajo con `validarLegajo()` y si no es válido lanza un error. Los campos opcionales usan el operador `??` para tomar la fecha actual o `true` como valores por defecto.
- **`validarLegajo()`**: método privado que valida que el legajo sea mayor o igual a `10000`. Retorna `false` si no cumple la condición.
- **`setIsActive()`**: actualiza el estado activo del alumno y registra la fecha de modificación automáticamente.
- **Getters**: `getLegajo()`, `getFechaAlta()`, `getModificacion()` e `getIsActive()` exponen los atributos privados de la clase.
- **`getAllAttributes()`**: sobreescribe el método de `PersonaModel` usando `override` y retorna todos los atributos del alumno combinando los de la clase padre con spread y agregando los propios.

```ts
export class AlumnoModel extends PersonaModel {
  private legajo: number;
  private fechaAlta: string;
  private modificacion: string;
  private isActive: boolean;
  constructor(
    legajo: number,
    nombre: string,
    apellido: string,
    email: string,
    fechaAlta?: string,
    modificacion?: string,
    isActive?: boolean
  ) {
      super(nombre, apellido, email);
      if (!this.validarLegajo(legajo)) {
        throw new Error("El legajo debe ser un número mayor o igual a 10000.");
      }
      this.legajo = legajo;
      const hoy = new Date().toISOString().split('T')[0];
      this.fechaAlta = fechaAlta ?? hoy;
      this.modificacion = modificacion ?? hoy;
      this.isActive = isActive ?? true;
    }
  private validarLegajo(legajo: number): boolean {
    if (legajo < 10000) {
      return false;
    }
    return true;
  }
  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
    this.modificacion = new Date().toISOString().split('T')[0];
  }
  public getLegajo(): number {
    return this.legajo;
  }
  public getFechaAlta(): string {
    return this.fechaAlta;
  }
  public getModificacion(): string {
    return this.modificacion;
  }
  public getIsActive(): boolean {
    return this.isActive;
  }
  public override getAllAttributes(): {
    nombre: string;
    apellido: string;
    email: string;
    legajo: number;
    fechaAlta: string;
    modificacion: string;
    isActive: boolean;
  } {
      return {
        ...super.getAllAttributes(),
        legajo: this.legajo,
        fechaAlta: this.fechaAlta,
        modificacion: this.modificacion,
        isActive: this.isActive,
    };
  }
}
```
---

## Estructura archivos JSON

**Alumnos**
```json
{
  "legajo": 10001,
  "nombre": "Mora",
  "apellido": "García",
  "email": "m.garcia@facultad.edu.ar",
  "fechaAlta": "2026-03-02",
  "modificacion": "2026-03-02",
  "isActive": true
}
```

---

## Tecnologías utilizadas

- **Node.js** 
- **Express** 
- **TypeScript** 
- **JavaScript** 
- **Docker** 
- **ESLint** 
- **Prettier** 
- **Husky** 
- **lint-staged** 
- **commitlint**
- **Git**

## Herramientas utilizadas

- **GitHub**
- **Render**
- **Postman**

---
