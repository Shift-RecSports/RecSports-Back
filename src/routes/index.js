import { deleteDeporte, getDeportes, getDeporte, postDeporte, updateDeporte } from "./Deportes";
import { getEspacios, getEspacio, postEspacio, updateEspacio, deleteEspacio} from "./Espacios";
import { getHistoriales, getHistorial, postHistorial, updateHistorial, deleteHistorial } from "./Historial";
import { getRegistrosGimnasio, getRegistroGimnasio, postRegistroGimnasio, updateRegistroGimnasio, deleteRegistroGimnasio  } from "./RegistrosGimnasio";

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

    getEspacios,
    getEspacio,
    postEspacio,
    updateEspacio,
    deleteEspacio,

    getHistoriales,
    getHistorial,
    postHistorial,
    updateHistorial,
    deleteHistorial

    
]
    
