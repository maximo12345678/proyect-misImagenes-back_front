//0: cd servidor    1: npm init -y   2. npm i express  3. npm i nodemon --save--dev   4.scripts . start: "nodemon server.js"    main: "server.js"
const express = require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');

const path = require('path');

const app = express(); //ejecutamos express

const routes = require('./routes'); //traemos lo que exporte el archivo ROUTES.JS, osea las rutas

app.set('port', process.env.PORT || 9000) //PROCESS es una variable de ambiente, es util cuando ya el hosting te da un puerto que podes usar, sino usa el 9000

const configBaseDatos = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'imagenes', //ya tenes que tner creada tu base de datos, tu esquema
}


//PARA PODER DARLE PERMISO AL SERVIDOR DE REACT DONDE CONSUMO LAS APIS
const cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}));

//le damos permiso al cliente de usar la carpeta con las fotos que trajimos en el get de la base de datos, por ejemplo http://localhost:9000/7-maxiyanez.png asi te trae muestra esa imagen
app.use(express.static(path.join(__dirname, 'dbimagenes'))) //dejo este directorio dbimagenes estatico y como que le doy permiso para que se pueda usar en el navegador en la ruta del l ado del servidor

// MIDDLEWARS - para la conexion con el banco de datos
app.use(myconn(mysql, configBaseDatos, 'single')); //instancia de sql, configuracion creada arriba y estrategia de conexion, puede ser PUL, REQUEST 

//para que la app o servidor lobre entender lo que viene por la peticion POST o la que sea
app.use(express.json());


// RUTAS ------------------------------
app.get('/api', (req, res) => { //recibe un requerimiento y una respuesta como parametro
    res.send("Probando la ruta principal pa")
})



//hacemos que el link del servidor web sea localhost:9000/api
app.use('/api', routes);


// CORRER EL SERVIDOR
app.listen(app.get('port'), () =>{ // con el get accedemos a la configuracion de la app que hicimos arriba
    console.log("Server corriendo en el puerto: ", app.get('port'))
})