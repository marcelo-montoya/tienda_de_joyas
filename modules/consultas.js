
const { obtenerListadoJoyasDB, obtenerJoyasPorFiltrosDB } = require('./controlador')

const obtenerListadoJoyas = async({ limits, order_by, page }) => {

    try {

        const resultadoConsulta = await obtenerListadoJoyasDB( limits, order_by, page );
        return resultadoConsulta;

    } catch (error) {

        return false
        
    }

};

const obtenerJoyasPorFiltros = async( {precio_max, precio_min, metal, categoria} ) => {

    try {

        const resultadoConsulta = await obtenerJoyasPorFiltrosDB( precio_max, precio_min, metal, categoria );
        return resultadoConsulta;
        
    } catch (error) {
        return false
    }

};

module.exports = {
    obtenerListadoJoyas,
    obtenerJoyasPorFiltros
};