
const format = require('pg-format');
const pool = require('./conexion');

const obtenerListadoJoyasDB = async({ limits = 3, order_by = 'stock_DESC', page = 0 }) => {

    const [ campo, direccion ] = order_by.split('_');
    const offset = page * limits;
    const formattedQuery = format( 'SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s', campo, direccion, parseInt(limits), offset );    
    pool.query( formattedQuery );    
    const { rows: joyas } = await pool.query( formattedQuery );
    return joyas;
};

const obtenerJoyasPorFiltrosDB = async ( precio_max, precio_min, metal, categoria ) => {

  let filtros = [];
  const values = [];


  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);

    const { length } = filtros;

    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };

  if (precio_max) agregarFiltro("precio", "<=", precio_max);
  if (precio_min) agregarFiltro("precio", ">=", precio_min);
  if (metal) agregarFiltro("metal", "=", metal);
  if (categoria) agregarFiltro("categoria", "=", categoria);  

  let consulta = "SELECT * FROM inventario";

  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }

  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;

};

const HATEOAS = (joyas) => {
  const results = joyas
    .map((j) => {
      return {
        name: j.nombre,
        href: `/joyas/joya/${j.id}`,
        stock: j.stock,
      };
    })
    .slice(0, 4);

  const total = joyas.length;

  let joyasMap = results.map((element) => {
    return element.stock;
  });

  const stockJoyas = joyasMap.reduce((resultado, elemento) => {
    return resultado + elemento;
  }, 0);

  const HATEOAS = {
    stockJoyas,
    total,
    results,
  };
  return HATEOAS;
};

const HATEOASFiltros = (joyas) => {
  const results = joyas
    .map((j) => {
      return {
        id: j.id,
        name: j.nombre,
        categoria: j.categoria,
        metal: j.metal,
        precio: j.precio,
        stock: j.stock
      };
    })
    .slice(0, 4);

  const total = joyas.length;

  let joyasMap = results.map((element) => {
    return element.stock;
  });

  const stockJoyas = joyasMap.reduce((resultado, elemento) => {
    return resultado + elemento;
  }, 0);

  const HATEOAS = {
    stockJoyas,
    total,
    results,
  };
  return HATEOAS;
};

module.exports = {
    obtenerListadoJoyasDB,
    obtenerJoyasPorFiltrosDB,
    HATEOAS, 
    HATEOASFiltros
};