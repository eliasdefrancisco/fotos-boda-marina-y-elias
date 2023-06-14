import { signal } from '@preact/signals'
import { useEffect, useState } from 'preact/hooks'
import { BucketDataJson, imageTypes } from 'src/types'
import styles from './Galeria.module.css'
import FullScreenImage from './FullScreenImage'
import { imageTailNames } from '../types'
import { SvgShare, SvgDownload } from './SvgImages'

type Props = {
	bucketData: BucketDataJson
	baseUrl: string
	tipo: typeof imageTypes[keyof typeof imageTypes]
}

export default function Galeria ({ bucketData, baseUrl, tipo }: Props) {
	const [imageFullScreen, setImageFullScreen] = useState('')
	const [showShare, setShowShare] = useState(false)


	const thumbnailUrlBase = tipo === imageTypes.fotocall_gifs
		? `${baseUrl}/${bucketData.urlBaseRelativa}`
		: `${baseUrl}/${bucketData.thumbnail.urlBaseRelativa}`

	const originalUrlBase = tipo === imageTypes.fotocall_gifs
		? `${baseUrl}/${bucketData.urlBaseRelativa}`
		: `${baseUrl}/${bucketData.original.urlBaseRelativa}`

	const visualizacionUrlBase = tipo === imageTypes.fotocall_gifs
		? `${baseUrl}/${bucketData.urlBaseRelativa}`
		: `${baseUrl}/${bucketData.visualizacion.urlBaseRelativa}`

	const thumbnailFiles = tipo === imageTypes.fotocall_gifs
		? bucketData.archivos
		: bucketData.thumbnail.archivos

	function handleImageClick (imageThumbName: string) {
		setImageFullScreen(imageThumbName)
	}

	function handleCloseFullScreen () {
		setImageFullScreen('')
	}

	// Download solo funcionará en HTTPS
	// Cors policy ha sido activada para todos los orígenes en el bucket de Cloud Storage
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

	// Share solo funcionará en HTTPS y con dispositivos que soporten la API Share
	// (Android, Safari, ..., pero no Chrome en escritorio)
	function hadleShare (imageThumbName: string) {
		const imageVisualizacionName = imageThumbName
			.replace(imageTailNames.thumbnail, imageTailNames.visualizacion)
		const imageVisualizacionUrl = `${visualizacionUrlBase}${imageVisualizacionName}`
		navigator.share({
			title: 'Boda Marina y Elías',
			text: 'Fotos de la boda de Marina y Elías',
			url: imageVisualizacionUrl
		})
	}

	useEffect(() => {
		setShowShare(!!window.navigator.share)
	}, [])


	return (
		<div class={styles.container}>
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
							<SvgDownload onClick={() => handleDownload(imageName)} />
							{
								showShare &&
								<SvgShare onClick={() => hadleShare(imageName)} />
							}
						</div>
					</li>
				))}
			</ul>
			{
				imageFullScreen &&
					<FullScreenImage
						imageFullScreen={imageFullScreen}
						thumbnailUrlBase={thumbnailUrlBase}
						handleCloseFullScreen={handleCloseFullScreen}
					/>
			}
		</div>
	)
}
