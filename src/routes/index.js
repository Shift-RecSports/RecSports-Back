import { deleteDeporte, getDeportes, postDeporte, updateDeporte } from "./Deportes";
import { getRegistrosGimnasio, postRegistroGimnasio } from "./RegistrosGimnasio";

import { getUsuario } from "./Usuarios";

export default[
    getUsuario,
    getDeportes, 
    postDeporte,
    updateDeporte,
    deleteDeporte,
    getRegistrosGimnasio,
    postRegistroGimnasio
]
    
