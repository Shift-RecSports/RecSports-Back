import { db } from "../database";
import shortid from 'shortid';

const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null, 'images')
  },
  filename: (req, file,cb)=>{
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }

})

const upload = multer({storage: storage});


// Define the post handler for uploading an image
export const uploadImage = {
  method: 'POST',
  path: '/api/upload-image',
  config: {
    payload: {
      output: 'stream',
      allow: ['image/jpeg', 'image/png']
    }
  },
  handler: async (req, h) => {
    try {
      // If there is no file in the request, return an error
      if (!req.payload.file) {
        throw new Error('No file uploaded');
      }

      // Save the file to the server
      const filename = req.payload.file.hapi.filename;
      const data = req.payload.file._data;
      const filepath = `./images/${filename}`;
      const file = await fs.writeFile(filepath, data);

      // Generate a unique ID for the image
      const id = shortid.generate();

      // Insert the image data into the database
      await db.query(
        `INSERT INTO Noticias (id, fecha, horario, url, imagen) VALUES (?, ?, ?, ?, ?)`,
        [id, new Date(), new Date().toLocaleTimeString(), 'http://example.com', filepath]
      );

      // Return a success message
      return { message: 'File uploaded successfully' };
    } catch (error) {
      // Return an error message if something goes wrong
      console.error(error);
      return { error: error.message };
    }
  }
};