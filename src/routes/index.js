import { deleteDeporte, getDeportes, getDeporte, postDeporte, updateDeporte } from "./Deportes";
import { getEspacios, getEspaciosDeporte, getEspacio, postEspacio, updateEspacio, deleteEspacio} from "./Espacios";
import { getHistoriales, getHistorial, postHistorial, updateHistorial, deleteHistorial,  getConcurrenciasAforoGimnasio  } from "./Historial";
import { uploadImage } from "./Images";
import { deleteNoticia, getNoticia, getNoticias, postNoticia, updateNoticia } from "./Noticias";
import { getRegistrosGimnasio, getRegistrosGimnasioFecha, getRegistroGimnasio, postRegistroGimnasio, postRegistroGimnasioMatricula, updateRegistroGimnasio, updateRegistroGimnasioMatricula, deleteRegistroGimnasio, getAforoActual } from "./RegistrosGimnasio";
import { getReservaciones, getReservacionesMatricula, getReservacionesDeporteFecha, getReservacion, postReservacion, updateReservacion, deleteReservacion } from "./Reservaciones";

import { getUsuario } from "./Usuarios";

export default[
    getUsuario,

    getDeportes,
    getDeporte, 
    postDeporte,
    updateDeporte,
    deleteDeporte,

    getRegistrosGimnasio,
    getRegistrosGimnasioFecha,
    getRegistroGimnasio,
    postRegistroGimnasio, 
    postRegistroGimnasioMatricula,
    updateRegistroGimnasio,
    updateRegistroGimnasioMatricula,
    deleteRegistroGimnasio,
    getAforoActual,
    

    getEspacios,
    getEspaciosDeporte,
    getEspacio,
    postEspacio,
    updateEspacio,
    deleteEspacio,
    

    getHistoriales,
    getHistorial,
    postHistorial,
    updateHistorial,
    deleteHistorial,
    getConcurrenciasAforoGimnasio,

    getReservaciones,
    getReservacionesMatricula,
    getReservacionesDeporteFecha,
    getReservacion,
    postReservacion,
    updateReservacion,
    deleteReservacion,

    getNoticias,
    getNoticia,
    postNoticia,
    updateNoticia,
    deleteNoticia,

    uploadImage

    
]
    
