import { deleteDeporte, getDeportes, getDeporte, postDeporte, updateDeporte } from "./Deportes";
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
    
]
    
