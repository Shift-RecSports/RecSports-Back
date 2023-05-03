import { deleteDeporte, getDeportes, getDeporte, postDeporte, updateDeporte } from "./Deportes";
import { getEspacios, getEspacio, postEspacio, updateEspacio, deleteEspacio} from "./Espacios";
import { getHistoriales, getHistorial, postHistorial, updateHistorial, deleteHistorial,  getConcurrenciasAforoGimnasio  } from "./Historial";
import { uploadImage } from "./Images";
import { deleteNoticia, getNoticia, getNoticias, postNoticia, updateNoticia } from "./Noticias";
import { getRegistrosGimnasio, getRegistroGimnasio, postRegistroGimnasio, updateRegistroGimnasio, deleteRegistroGimnasio, getAforoActual } from "./RegistrosGimnasio";

import { getUsuario } from "./Usuarios";

export default[
    getUsuario,

    getDeportes,
    getDeporte, 
    postDeporte,
    updateDeporte,
    deleteDeporte,

    getRegistrosGimnasio,
    getRegistroGimnasio,
    postRegistroGimnasio, 
    updateRegistroGimnasio,
    deleteRegistroGimnasio,
    getAforoActual,
    

    getEspacios,
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

    getNoticias,
    getNoticia,
    postNoticia,
    updateNoticia,
    deleteNoticia,

    uploadImage

    
]
    
