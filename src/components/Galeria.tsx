import { signal } from '@preact/signals'
import { BucketDataJson, imageTypes } from 'src/types'
import styles from './Galeria.module.css'
import FullScreenImage from './FullScreenImage'
import { imageTailNames } from '../types'

type Props = {
	bucketData: BucketDataJson
	baseUrl: string
	tipo: typeof imageTypes[keyof typeof imageTypes]
}

export default function Galeria ({ bucketData, baseUrl, tipo }: Props) {
	const lastClickOn = signal('')
	const imageFullScreen = signal('')

	const thumbnailUrlBase = tipo === imageTypes.fotocall_gifs
		? `${baseUrl}/${bucketData.urlBaseRelativa}`
		: `${baseUrl}/${bucketData.thumbnail.urlBaseRelativa}`

	const originalUrlBase = tipo === imageTypes.fotocall_gifs
		? `${baseUrl}/${bucketData.urlBaseRelativa}`
		: `${baseUrl}/${bucketData.original.urlBaseRelativa}`

	const thumbnailFiles = tipo === imageTypes.fotocall_gifs
		? bucketData.archivos
		: bucketData.thumbnail.archivos

	function handleImageClick (imageThumbName: string) {
		imageFullScreen.value = imageThumbName
	}

	function handleDownload (imageThumbName: string) {
		const imageOriginalName = imageThumbName
			.replace(imageTailNames.thumbnail, '')
			.replace('.webp', '.jpg')
		const imageOriginalUrl = `${originalUrlBase}${imageOriginalName}`

		fetch(imageOriginalUrl)
			.then(respuesta => respuesta.blob())
			.then(blob => {
				// Crear un objeto URL para el blob
				const urlBlob = window.URL.createObjectURL(blob)

				// Crear un enlace para la descarga
				const enlace = document.createElement('a')
				enlace.href = urlBlob
				enlace.download = 'boda_marina_y_elias.jpg'

				// Añadir el enlace al cuerpo del documento (necesario para Firefox)
				document.body.appendChild(enlace)

				// Simular un clic en el enlace
				enlace.click()

				// Eliminar el enlace del cuerpo del documento después de descargar la imagen
				document.body.removeChild(enlace)
			})
			.catch(error => console.error('Error:', error))
	}


	return (
		<div class={styles.container}>
			<p>lastClickOn: {lastClickOn}</p>
			<ul class={styles.galeryContainer}>
				{thumbnailFiles.map((imageName, index) => (
					<li key={index} class={styles.item}>
						<img
							src={`${thumbnailUrlBase}${imageName}`}
							class={`${styles.image} ${styles[tipo]}`}
							alt={imageName}
							onClick={() => handleImageClick(imageName)}
						/>
						<div class={styles.imageControls}>
							<span
								class={styles.buttonShare}
								onClick={() => (lastClickOn.value = 'Share')}
							>🥎</span>
							<span
								class={styles.buttonDownload}
								onClick={() => handleDownload(imageName)}
							>⬇️</span>
						</div>
					</li>
				))}
			</ul>
			{
				imageFullScreen &&
					<FullScreenImage imageFullScreen={imageFullScreen} thumbnailUrlBase={thumbnailUrlBase} />
			}
		</div>
	)
}
