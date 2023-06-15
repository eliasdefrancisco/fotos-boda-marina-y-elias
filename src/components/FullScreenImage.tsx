import { useEffect, useState } from 'preact/hooks'
import styles from './FullScreenImage.module.css'
import { imageTailNames, imageDirectoryNames } from '../types'
import { SvgClose } from './SvgImages'

export default function FullScreenImage ({ imageFullScreen, thumbnailUrlBase, handleCloseFullScreen }) {
	const srcThumbnail = `${thumbnailUrlBase}${imageFullScreen}`
	const srcVisualizacon = srcThumbnail
		.replace(imageTailNames.thumbnail, imageTailNames.visualizacion)
		.replace(imageDirectoryNames.thumbnail, imageDirectoryNames.visualizacion)

	const [imgSrc, setImgSrc] = useState(srcThumbnail)

	function closeFullScreen () {
		document.documentElement.style.overflowY = 'auto' // re-enable scroll
		handleCloseFullScreen()
	}

	function handleCloseBtn () {
		// Si se cierra con X, simula el comportamiento del boton de retroceso del navegador
		history.back()
		closeFullScreen()
	}

	// El boton de retroceso del navegador cierra el modal, pero no vuelve a la página anterior
	useEffect(() => {
		history.pushState(null, null, document.URL)
		const handleBackButton = event => {
			event.preventDefault()
			closeFullScreen()
		}
		window.addEventListener('popstate', handleBackButton)
		return () => {
			window.removeEventListener('popstate', handleBackButton)
		}
	}, [])

	// Load large image when component is mounted
	useEffect(() => {
		document.documentElement.style.overflowY = 'hidden' // disable scroll
		setImgSrc(srcThumbnail)
		const img = new Image()
		img.src = srcVisualizacon
		img.onload = () => {
			setImgSrc(srcVisualizacon) // set to large image when it is loaded
		}
		return () => {
			document.documentElement.style.overflowY = 'auto' // re-enable scroll
		}
	}, [imageFullScreen])


	return (
		<div class={styles.container}>
			<div class='background' />
			<img
				src={imgSrc}
				class={styles.image}
				alt={'foto de boda'}
			/>
			<SvgClose class={styles.closeIcon} onClick={handleCloseBtn} />
		</div>
	)
}