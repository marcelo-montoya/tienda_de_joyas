
const express = require('express');
const app = express();
const cors = require('cors');

const { HATEOAS, HATEOASFiltros } = require('./modules/controlador')
const {obtenerListadoJoyas, obtenerJoyasPorFiltros} = require('./modules/consultas')

app.listen(3000, console.log('Server ON and Running'));

app.use(cors());
app.use(express.json());

app.get('/joyas', async(req, res) => {

    const queryString = req.query;
    const resultadoConsulta = await obtenerListadoJoyas(queryString);
    const resultadoHATEOAS = HATEOAS(resultadoConsulta);

    if (!resultadoHATEOAS) {
      res.status(500).send('Error al obtener el listado');
    } else {
      res.status(200).json(resultadoHATEOAS);
    }

});

app.get("/joyas/filtros", async (req, res) => {
  const queryStrings = req.query;
  const joyasPorFiltro = await obtenerJoyasPorFiltros(queryStrings);
  const resultadoHATEOAS = HATEOASFiltros(joyasPorFiltro);
  if (!resultadoHATEOAS) {
    res.status(500).send('Error al obtener el listado');
  } else {
    res.status(200).json(resultadoHATEOAS);
  }
});

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});