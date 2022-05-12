import express, { static as Static } from "express"
import path from 'path'
import { initializeFirebaseApp, getStorageBucket } from './util/db.js'
initializeFirebaseApp()

import compression from 'compression'
import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|)$/))
            return cb(new Error('Please upload an image with a correct format (jpg, jpeg, png)'))

        cb(undefined, true)
    }
})

import router from './routes/userRoutes.js'

const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(Static("public"))

app.use(compression())

app.use("", router)

app.set("port", (process.env.PORT || 3000))

app.locals.bucket = getStorageBucket()

app.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        const name = req.file.originalname // saltedMd5(req.file.originalname, 'SUPER-S@LT!')
        const fileName = 'folder1/' + name // + path.extname(req.file.originalname)

        const blob = app.locals.bucket.file(fileName)
        const blobWriter = await blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            }
        })

        blobWriter.on('error', (err) => {
            console.log('Error:: ', err);
            next(err)
        });
        blobWriter.on('finish', () => {
            // Assembling public URL for accessing the file via HTTP
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${app.locals.bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
            // Return the file name and its public URL
            res.status(200).send({ fileName: req.file.originalname, fileLocation: publicUrl});
        })

        // When there is no more data to be consumed from the stream
        await blobWriter.end(req.file.buffer)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

app.listen(app.get("port"), () => {
    console.log("Server Running on port " + app.get("port"))
})