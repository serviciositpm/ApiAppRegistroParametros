const config = require('../configuraciones/configuracion_base');
const logger = require('../utils/logger'); 
/* const sql = require('mssql'); */
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const app = express();

//---------------------------------------------------------
/*Ruta Para Insertar/Actualizar los datos en las tablas  */
//---------------------------------------------------------
app.post('/insertaractualizarregistrosparametros', function(req, respuesta) {
    let datos = JSON.stringify(req.body);
    let query = 'Sp_Dat_Parametros_Inserta_Actualiza_Registros';
    logger.info(`Datos Recibidos: ${datos}`); 
    console.log(datos);
    datosConsultaSP(query, datos).then(datosconsultasp => {
        respuesta.json(datosconsultasp[0][0]);
    })
    

})

//---------------------------------------------------------
/*Ruta para Get Obtener las Registros */
//---------------------------------------------------------
app.get('/obtenerregistrosparametros', function(req, respuesta) {
    let opcion      =   req.query.opcion;
    let usuario     =   req.query.usuario;
    let camaronera  =   req.query.camaronera;
    let anio        =   req.query.anio;
    let piscina     =   req.query.piscina;
    let ciclo       =   req.query.ciclo;
    let fecha       =   req.query.fecha;
    let codform     =   req.query.codform;
    let query       =   'Sp_Dat_Parametros_Consulta_Registros';

    datosRegistrosParametros(query, opcion,usuario,camaronera,anio,piscina,ciclo,fecha,codform).then(datosconsultasp => {
        respuesta.json(datosconsultasp[0]);
    })
    

})
//---------------------------------------------------------
/*Ruta para Get Obtener las camaroneras */
//---------------------------------------------------------
app.get('/obtenercamaronerasxusuario', function(req, respuesta) {
    let opcion      =   req.query.opcion;
    let usuario     =   req.query.usuario;
    let camaronera  =   req.query.camaronera;
    let anio        =   req.query.anio;
    let piscina     =   req.query.piscina;
    let ciclo       =   req.query.ciclo;
    let query       =   'Sp_Dat_Parametros_Valida_Accesos';

    datosParametrosAccesos(query, opcion,usuario,camaronera,anio,piscina,ciclo).then(datosconsultasp => {
        respuesta.json(datosconsultasp[0]);
    })
    

})

//---------------------------------------------------------
/*Ruta para post para devolver los datos de las Guias x Dìa */
//---------------------------------------------------------
app.post('/validarusr', function(req, respuesta) {
    let datos = JSON.stringify(req.body);
    let query = 'Sp_Dat_Bines_Valida_Usuarios';
    datosConsultaSP(query, datos).then(datosconsultasp => {
        respuesta.json(datosconsultasp[0][0]);
    })
    

})

//---------------------------------------------------------
/*Ruta para Get para devolver los datos de las Guias x Dìa */
//---------------------------------------------------------
app.get('/dataguiasdia', function(req, respuesta) {
    let query = 'Sp_Datos_App_Bines';
    let nroguia ='';
    //console.log(JSON.stringify(datos));
    datosGuiasDia(query,'GDIA',nroguia).then(datosguiadia => {
        respuesta.json(datosguiadia[0]);
    })
    

})
//---------------------------------------------------------
/*Ruta para Get para devolver los datos de las Guias x Dìa */
//---------------------------------------------------------
app.get('/obtenerguias', function(req, respuesta) {
    let query = 'Sp_Datos_App_Guias_Bines';
    let nroguia = req.query.nroguia;
    let opcion = req.query.opcion;
    let usuario = req.query.usuario;

    console.log(usuario);
    //console.log(JSON.stringify(datos));
    datosGuiasAppBines(query,nroguia,opcion,usuario).then(datosguiadia => {
        respuesta.json(datosguiadia[0]);
    })
    

})
//---------------------------------------------------------
/*Ruta para Post Registrar los Datos de las Guías */
//---------------------------------------------------------
app.post('/regtiempoguia', function(req, respuesta) {
    let query = 'Sp_Datos_App_Guias_Bines';
    let nroguia = req.body.nroguia;
    let opcion = req.body.opcion;
    let usuario = req.body.usuario;

    console.log(usuario);
    //console.log(JSON.stringify(datos));
    datosGuiasAppBines(query,nroguia,opcion,usuario).then(datosguiadia => {
        respuesta.json(datosguiadia[0]);
    })
    

})
//---------------------------------------------------------
/*Conexion al Sp que devuelve guias registradas y procesadas*/
//---------------------------------------------------------
app.get('/obtenerguiasregistradas', function(req, respuesta) {
    let nroguia = req.query.nroguia;
    let opcion = req.query.opcion
    let query = 'Sp_Datos_App_Bines';
    //console.log(JSON.stringify(datos));
    datosGuiasDia(query,opcion,nroguia).then(datosguiadia => {
        respuesta.json(datosguiadia[0]);
    })
})
//---------------------------------------------------------
/*Conexion al Sp que devuelve los Bines Registrados por guìa*/
//---------------------------------------------------------
app.get('/obtenerbinesguia', function(req, respuesta) {
    let nroguia = req.query.nroguia;
    let opcion = req.query.opcion
    let query = 'Sp_Datos_App_Bines';
    //console.log(JSON.stringify(datos));
    datosGuiasDia(query,opcion,nroguia).then(datosguiadia => {
        respuesta.json(datosguiadia[0]);
    })
})
//---------------------------------------------------------
/*Ruta para Post de Registros de Bines Asignados por guìa */
//---------------------------------------------------------
app.post('/binesguia', function(req, respuesta) {
    let nroguia = req.body.nroguia;
    let nrobin = req.body.nrobin;
    let fechahra = req.body.fechahra;
    let opcion = req.body.opcion
    let query = 'Insert_Datos_App_Bines';
    //console.log(JSON.stringify(datos));
    datosGuiasBines(query,nroguia,nrobin,fechahra,opcion).then(datosguiadia => {
        respuesta.json(datosguiadia[0]);
    })
})


//---------------------------------------------------------
/*Conexion al Sp que devuelve los registros de las guias*/
//---------------------------------------------------------
let datosGuiasDia = async(query,opcion,nroguia) => {
    try {
        let pool = await sql.connect(config);
        let datguia = await pool.request()
            .input('opcion', sql.Char, opcion)
            .input('nroguia', sql.Char, nroguia)
            .execute(query);
        
        return datguia.recordsets;
        
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------
/*Conexion al Sp que Realiza las Inserciones*/
//---------------------------------------------------------
let datosGuiasAppBines = async(query,nroguia,opcion,usuario) => {
    try {
        let pool = await sql.connect(config);
        let datguia = await pool.request()
            .input('opcion', sql.Char, opcion)
            .input('nroguia', sql.Char, nroguia)
            .input('usuario', sql.Char, usuario)
            .execute(query);
        
        return datguia.recordsets;
        
    } catch (error) {
        console.log(error);
    }


}
//---------------------------------------------------------
/*Conexion al Sp que Realiza las Inserciones*/
//---------------------------------------------------------
let datosGuiasBines = async(query,nroguia,nrobin,fechahra,opcion) => {
    try {
        let pool = await sql.connect(config);
        let datguia = await pool.request()
            .input('opcion', sql.Char, opcion)
            .input('nroguia', sql.Char, nroguia)
            .input('nroBin', sql.Char, nrobin)
            .input('fechahra', sql.Char, fechahra)
            .execute(query);
        
        return datguia.recordsets;
        
    } catch (error) {
        console.log(error);
    }


}
/*Conexion a SP para que nos devuelva los datos*/
let datosConsultaSP = async(query, datos) => {
    try {
        let pool = await sql.connect(config);
        let datossp = await pool.request()
            .input('pjson', sql.Char, datos)
            .execute(query);
        /* console.log(clientes); */
        return datossp.recordsets;
        /* return clientes; */
    } catch (error) {
        console.log(error);
    }


}

//---------------------------------------------------------
/*Conexion al Sp que Realiza las COnsultas */
//---------------------------------------------------------
let datosParametrosAccesos = async(query, opcion,usuario,camaronera,anio,piscina,ciclo) => {
    try {
        let pool = await sql.connect(config);
        let datparametros = await pool.request()
            .input('opcion', sql.Char, opcion)
            .input('usuario', sql.Char, usuario)
            .input('camaronera', sql.Char, camaronera)
            .input('anio', sql.Int, anio)
            .input('piscina', sql.Char, piscina)
            .input('ciclo', sql.Char, ciclo)
            .execute(query);

        return datparametros.recordsets;
        
        
    } catch (error) {
        console.log(error);
    }


}
//---------------------------------------------------------
/*Conexion al Sp que Realiza las COnsultas */
//---------------------------------------------------------
let datosRegistrosParametros = async(query, opcion,usuario,camaronera,anio,piscina,ciclo,fecha,codform) => {
    try {
        let pool = await sql.connect(config);
        let datparametros = await pool.request()
            .input('opcion', sql.Char, opcion)
            .input('usuario', sql.Char, usuario)
            .input('camaronera', sql.Char, camaronera)
            .input('anio', sql.Int, anio)
            .input('piscina', sql.Char, piscina)
            .input('ciclo', sql.Char, ciclo)
            .input('fecha', sql.Char, fecha)
            .input('codform', sql.Numeric, codform)
            .execute(query);

        return datparametros.recordsets;
        
        
    } catch (error) {
        console.log(error);
    }


}

module.exports = app;