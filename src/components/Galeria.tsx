import { useEffect, useRef, useState } from 'preact/hooks'
import { BucketDataJson, imageTypes } from 'src/types'
import styles from './Galeria.module.css'
import FullScreenImage from './FullScreenImage'
import { imageTailNames } from '../types'
import { SvgShare, SvgDownload } from './SvgImages'

type Props = {
	bucketData: BucketDataJson
	baseUrl: string
	tipo: typeof imageTypes[keyof typeof imageTypes],
	title: string
}


export default function Galeria ({ bucketData, baseUrl, tipo, title }: Props) {
	const imagesToLoadEachTime = 20
	const loadImagesScrollDistance = '1000px'
	const loader = useRef(null)
	const [imagesLoaded, setImagesLoaded] = useState(imagesToLoadEachTime)
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


	// Abre la imagen en pantalla completa
	function handleImageClick (imageThumbName: string) {
		setImageFullScreen(imageThumbName)
	}


	// Cierra la imagen en pantalla completa
	function handleCloseFullScreen () {
		setImageFullScreen('')
	}


	// Download solo funcionará en HTTPS
	// Cors policy ha sido activada para todos los orígenes en el bucket de Cloud Storage
	function handleDownload (imageThumbName: string) {
		let imageOriginalName
		if (tipo === imageTypes.fotocall_gifs) {
			imageOriginalName = imageThumbName
		}
		else {
			imageOriginalName = imageThumbName
				.replace(imageTailNames.thumbnail, '')
				.replace('.webp', '.jpg')
		}
		const imageOriginalUrl = `${originalUrlBase}${imageOriginalName}`

		fetch(imageOriginalUrl)
			.then(respuesta => respuesta.blob())
			.then(blob => {
				// Crear un objeto URL para el blob
				const urlBlob = window.URL.createObjectURL(blob)
				// Crear un enlace para la descarga
				const enlace = document.createElement('a')
				enlace.href = urlBlob
				enlace.download = imageOriginalName
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
	function handleShare (imageThumbName: string) {
		let imageVisualizacionName
		if (tipo === imageTypes.fotocall_gifs) {
			imageVisualizacionName = imageThumbName
		}
		else {
			imageVisualizacionName = imageThumbName
				.replace(imageTailNames.thumbnail, imageTailNames.visualizacion)
		}
		const imageVisualizacionUrl = `${visualizacionUrlBase}${imageVisualizacionName}`
		navigator.share({
			title: 'Boda Marina y Elías',
			text: 'Fotos de la boda de Marina y Elías',
			url: imageVisualizacionUrl
		})
	}


	// Maneja la carga de imagenes dinamicamente con IntersectionObserver
	const handleObserver = (entities, observer) => {
		const target = entities[0]
		if (target.isIntersecting) {
			// Carga más imágenes cuando el elemento cargador es visible
			setImagesLoaded((prev) => prev + imagesToLoadEachTime)

			// Si no hay más imágenes para cargar, desasociamos el observer
			if (imagesLoaded >= thumbnailFiles.length) {
				observer.unobserve(target.target)
			}
		}
	}


	// Devuelve un array con los nombres de las imágenes a renderizar
	const getImagesToRender = () => {
		return thumbnailFiles.slice(0, imagesLoaded)
	}


	// Inicia el Observador del IntersectionObserver
	useEffect(() => {
		const observer = new IntersectionObserver(
			handleObserver,
			{ threshold: 1, rootMargin: loadImagesScrollDistance }
		)
		if (loader.current) {
			observer.observe(loader.current)
		}
		return () => observer.disconnect() // limpiar el observer cuando el componente se desmonte
	}, [imagesLoaded]) // Reejecuta useEffect cuando imagesLoaded cambie


	// Comprobar si el navegador soporta la API Share para mostrar el botón de compartir
	useEffect(() => {
		setShowShare(!!window.navigator.share)
	}, [])


	return (
		<div class={styles.container}>
			<div style={{ visibility: imageFullScreen ? 'hidden' : 'visible' }}>
				<h1>{title}</h1>
				<ul class={styles.galeryContainer}>
					{getImagesToRender().map((imageName, index) => (
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
                <SvgShare onClick={() => handleShare(imageName)} />
								}
							</div>
						</li>
					))}
					<li ref={loader} class={styles.loader}>
						{/* Elemento observado por IntersectionObserver para LazyLoading */}
						{imagesLoaded < thumbnailFiles.length && 'Tonto el que lo lea 🤪'}
					</li>
				</ul>
			</div>
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
