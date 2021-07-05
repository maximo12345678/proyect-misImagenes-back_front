import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, ModalHeader, Modal, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap'
import VerOBorrar from './componentes/VerOBorrar'

import { useStateValue } from './StateProvider'
import {actionTypes} from './reducer'

const App = () => {

  const [file, setFile] = useState(null)

  const [{modalVerOBorrar, arrayImagenes }, dispatch] = useStateValue()

  const guardarArchivo = e => {
    setFile(e.target.files[0])
  }

  const enviarArchivo = async () => {

    document.getElementById('fileInput').value = null //asi reseteamos el input de la imagen


    if (!file) {//validamos que no haya enviado algo vacio, si cancelo cuando se le abrio para seleccionar
      alert("Selecciona un archivo para enviar!")
      return
    }


    //darle formato de imagen . FORMDATA es de javascript
    const formData = new FormData()
    formData.append('imagen', file) //este metodo es para agregar. formateamos el archivo cargado

    // AXIOS
    await axios.post(`http://localhost:9000/api`, formData)
      .then(response => {
        traerImagenes()
      })
      .catch(error => {
        console.log(error)
      })

    //document.getElementById('fileInput').value = null //asi reseteamos el input de la imagen

    setFile(null)
  }

  const traerImagenes = () => {

    fetch('http://localhost:9000/api/imagenes')
      .then(res => res.json())
      .then(res => 
        dispatch({
          type: actionTypes.SET_ARRAY_IMAGENES,
          arrayImagenes: res
        })
      ) 
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => { //aca vamos a hacer una consulta, traemos la lista de imagenes y la guardamos en nuestro array listaImagenes


    traerImagenes()

  }, [])

  const modificarModalVerOBorrar = () =>{
    dispatch({
      type: actionTypes.SET_MODAL_VER_O_BORRAR,
      modalVerOBorrar: true
    })
  }

  const [imagenSeleccionada, setImagenSeleccionada] = useState("")

  return (
    <div>
      <nav>
        <ul style={{ display: "flex", background: "gray", padding: "15px", alignItems: "center", margin: 0 }}>
          <li style={{ listStyle: "none", padding: "20px" }} className="link-danger">Inicio</li>
          <li style={{ listStyle: "none", padding: "20px" }} className="link-info">Contacto</li>
          <li style={{ listStyle: "none", padding: "20px" }} className="link-success">Imagenes</li>
        </ul>
      </nav>
      <div className="container">
        <div className="card card-body mt-5">
          <div className="row">

            <label> Imagen</label>
            <div className="col-10">
              <input id="fileInput" onChange={guardarArchivo} type="file" className="form-control" placeholder="Seleccione una imagen" />
            </div>

            <div className="col-2">
              <button onClick={enviarArchivo} type="submit" className="btn btn-secondary" >Save</button>
            </div>

          </div>
        </div>

        <br></br> <br></br>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {
            arrayImagenes.map(image => (
              <div key={image} className="card" style={{ margin: "5px" }}>
                <img src={`http://localhost:9000/${image}`} alt="Imagen db" className="card-img-top" style={{ height: "200px", width: "300px" }}></img>
                <button 
                  onClick={(e)=>
                  {
                    modificarModalVerOBorrar()
                    setImagenSeleccionada(image)
                  }} 
                  className="btn btn-info" 
                  type="submit" 
                  title="Ver mas grande la imagen">
                    View more
                  </button>

              </div>
            ))
          }
        </div>
      </div>

      {
        modalVerOBorrar ?
        (
          <VerOBorrar imagen={imagenSeleccionada}></VerOBorrar>
        )
        :
        (
          <span></span>
        )
      }


    </div>
  )
}
export default App;
