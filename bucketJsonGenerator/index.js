import { Storage } from '@google-cloud/storage'
import fs from 'fs'

const bucketName = 'marina_y_elias_fotos_boda'
const storage = new Storage()

async function listarArchivosEnBucket (nombreBucket) {
	const [archivos] = await storage.bucket(nombreBucket).getFiles()

	const estructura = {
		urlBase: '' // Aquí guardaremos la base de la URL
	}

	archivos.forEach((archivo, i) => {
		const partes = archivo.name.split('/')

		let nivelActual = estructura
		let urlBaseRelativa = ''

		partes.forEach((parte, index) => {
			if (i === 0 && index === 0) {
				// Si es la primera vez, guardamos la base de la URL
				const url = archivo.publicUrl()
				const urlPartes = url.split('/')
				urlPartes.pop() // Quitamos la última parte de la URL, que es variable
				estructura.urlBase = urlPartes.join('/') // Guardamos la base de la URL
			}

			urlBaseRelativa += parte + '/'

			// Si es la última parte, es un archivo
			if (index === partes.length - 1) {
				if (!nivelActual.archivo) {
					nivelActual.archivo = []
				}

				// Solo guardamos la última parte de la URL en un array de strings simple
				nivelActual.archivo.push(parte)
			} else {
				// Si no es la última parte, es un directorio
				if (!nivelActual[parte]) {
					nivelActual[parte] = {
						urlBaseRelativa // Guardamos la URL base relativa para este nivel
					}
				}

				nivelActual = nivelActual[parte]
			}
		})
	})

	return estructura
}

async function generarJson (nombreBucket) {
	const estructura = await listarArchivosEnBucket(nombreBucket)

	fs.writeFileSync('estructura_ficheros_bucket.json', JSON.stringify(estructura, null, 4))

	console.log('Estructura de ficheros generada: ', nombreBucket)
}

generarJson(bucketName)
