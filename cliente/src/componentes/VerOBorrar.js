import React, {useState} from 'react'
import { Button, ModalHeader, Modal, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap'
import axios from 'axios'
import { useStateValue } from '../StateProvider'
import { actionTypes } from '../reducer'



const VerOBorrar = (props) => {

    const [{ modalVerOBorrar, arrayImagenes }, dispatch] = useStateValue()

    const modificarModalVerOBorrar = () => {
        dispatch({
            type: actionTypes.SET_MODAL_VER_O_BORRAR,
            modalVerOBorrar: false
        })
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

    const borrarImagen = async () => {

        let idImagen = props.imagen.split('-')
        idImagen = parseInt(idImagen[0])

        await axios.delete(`http://localhost:9000/api/imagenes/${idImagen}`)
            .then(res => {
                modificarModalVerOBorrar()
                setModalConfirmacion(false)
                traerImagenes()
            })
            .catch(err => {
                console.log(err)
            })
    }


    const [modalConfirmacion, setModalConfirmacion] = useState(false)



    return (
        <div>

            {
                <Modal isOpen={modalVerOBorrar}>



                    <ModalBody>
            
                        <img src={`http://localhost:9000/${props.imagen}`} alt="Imagen db" className="card-img-top" style={{ maxHeight: "auto", maxWidth: "auto" }}></img>
            
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            className="btn btn-danger"
                            onClick={(e) => {
                                setModalConfirmacion(true)
                            }}
                            title="Borrar foto">Delete
                        </Button>
                        <Button color="secondary" onClick={(e) => { modificarModalVerOBorrar() }}> Cerrar </Button>
                    </ModalFooter>

                </Modal>
            }



            {
                <Modal isOpen={modalConfirmacion}>

                    <ModalHeader>
                        Estas seguro de eliminar esta imagen?
                    </ModalHeader>


                    <ModalFooter>
                        <Button color="primary" onClick={(e) => { borrarImagen(e) }} >Borrar imagen</Button>
                        <Button color="secondary" onClick={(e) => { setModalConfirmacion(false) }}> No </Button>
                    </ModalFooter>

                </Modal>

            }
            
        </div>
    )
}


export default VerOBorrar;