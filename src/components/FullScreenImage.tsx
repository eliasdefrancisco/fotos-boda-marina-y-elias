import { useEffect, useState } from 'preact/hooks'
import styles from './FullScreenImage.module.css'
import { imageTailNames, imageDirectoryNames } from '../types'

export default function FullScreenImage ({ imageFullScreen, thumbnailUrlBase }) {
	if (!imageFullScreen.value) return null

	const srcThumbnail = `${thumbnailUrlBase}${imageFullScreen.value}`
	const srcVisualizacon = srcThumbnail
		.replace(imageTailNames.thumbnail, imageTailNames.visualizacion)
		.replace(imageDirectoryNames.thumbnail, imageDirectoryNames.visualizacion)

	const [imgSrc, setImgSrc] = useState(srcThumbnail)


	function handleClose () {
		document.documentElement.style.overflowY = 'auto' // re-enable scroll
		imageFullScreen.value = ''
	}

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
	}, [imageFullScreen.value])


	return (
		<div class={styles.container}>
			<img
				src={imgSrc}
				class={styles.image}
				alt={'foto de boda'}
			/>
			<p class={styles.closeIcon} onClick={handleClose}>❌</p>
		</div>
	)
}