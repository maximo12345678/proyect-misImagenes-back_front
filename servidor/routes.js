const express = require('express')

const routes = express.Router() //metodo de express para crear las rutas


//middleware -  es algo que se ejecuta antes de ejecutar las peticiones
const multer = require('multer') //es un middleware para poder subir imagenes a la BD (ver documentacion)
const path = require('path') //lo usamos para usar su metodo JOIN para juntar 2 rutas
const fs = require('fs') //para leer el archivo de la imagen


//configracion del multer. necesita recibir la imagen y almacenarla temporalmente en una carpeta para que el servidor la use despues 
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, 'imagenes'), //aca se crea o guarda en la carpeta imagenes
    filename: (req, file, cb) => { //recibe el requerimiento, el archivo y la callback
        cb(null, Date.now() + "-" + file.originalname) //para que sean unicos los nombres, con Date.now() le ponemos la fecha de subida + el nombre del archivo como vos lo tenias guardado en tu pc. habria que agregarle un UNIQID por las dudas
    }
})


//para recibir la imagen
const fileUpload = multer ({ //recibe un objeto con las propiedades del storage
    storage: diskstorage
}).single('imagen')//IMAGE ES EL MISMO QUE EL QUE LE PUSIMOS A LA IMAGEN EN REACT






// tipo de dato LONGBLOB -> objeto largo del tipo binario, los datos de la imagen estaran en tipo binario
routes.post('/', fileUpload,(req, res)=>{ //fileUpload sube la imagen a la carpeta IMAGES temporalmente, aca las subimos a la tabla
    
    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")

        const tipo = req.file.mimetype //MIMETYPE es la propiedad del file, es el formato
        const nombre = req.file.originalname
        const datos = fs.readFileSync(path.join(__dirname, 'imagenes', req.file.filename)) //este metodo de FS permite leer un archivo, hay qye pasarle la ruta donde esta. la tenemos en PATH en este caso. req.file esta todos los datos de la imagen, filename el nombre que creamos arriba de todo

        conn.query('INSERT INTO fotos set ?', [{tipo, nombre, datos}], (err, rows) =>{//el array corresponde al signo de pregunta, y la arrow function que recibe un error o las rows(fila). TIPO, NOMBRE, DATOS con el mismo nombre que en la base, sino pones tipo: datos: dato
            if (err) return res.status(500).send("Error of service 2")
            
            res.send("Image saved succefully!!")
        })
    })
 
    //console.log(req.file)

})


// GET
routes.get('/imagenes', (req, res)=>{ //fileUpload sube la imagen a la carpeta IMAGES temporalmente, aca las subimos a la tabla
    
    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")

        conn.query('SELECT * FROM fotos', (err, rows) =>{ //obtenemos las filas que estan en la base de datos
            if (err) return res.status(500).send("Error of service 2")
            
            rows.map( img =>{
                fs.writeFileSync(path.join(__dirname, 'dbimagenes/' + img.id + '-maxiyanez.png'), img.datos) //ruta donde colocar la imagen. concatenamos con path, dirname que es la ruta raiz del directorio con la carpeta que creamos de imagenes para guardar temporalmente las que vienen de la consulta a la base. pasamos la ruta y los datos
            })

            //defino array donde guardo el nombre de cada imagen
            const directorioImagen = fs.readdirSync( path.join(__dirname, 'dbimagenes/') ) //esto lee los archivos que hay en un directorio y retorna los nombres de los archivos. recibe la ruta de path

            res.json(directorioImagen) //el objeto javascript de rows lo transofrmamos a json y lo mandamos como respuesta
            
            console.log(fs.readdirSync( path.join(__dirname, 'dbimagenes/') )) //asi vemos que es lo que trae la consulta
        })
    })
 
})



// DELETE
routes.delete('/imagenes/:id',(req, res)=>{ //en REQ esta el ID
    
    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")

        conn.query('DELETE FROM fotos WHERE id = ?', [req.params.id], (err, rows) =>{ //obtenemos las filas que estan en la base de datos
            if (err) return res.status(500).send("Error of service 2")
            

            // HAY QUE ELIMINARLA TAMBIEN DE LA CARPETA DE FOTOS, NO SOLO DE LA BASE DE DATOS COMO ARRIBA

            fs.unlinkSync(path.join(__dirname, 'dbimagenes/' + req.params.id + '-maxiyanez.png')) //funcion de FS para borrar un archivo,  es sincronica


            res.send("Imagen borrada ")
        })
    })
 
})




module.exports = routes //exportamos routes de esta maneracls
