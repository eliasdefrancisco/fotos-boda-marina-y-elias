import { signal } from '@preact/signals'
import { BucketDataJson, imageTypes } from 'src/types'
import styles from './Galeria.module.css'
import FullScreenImage from './FullScreenImage'

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

	const thumbnailFiles = tipo === imageTypes.fotocall_gifs
		? bucketData.archivos
		: bucketData.thumbnail.archivos

	function handleImageClick (imageName: string) {
		imageFullScreen.value = imageName
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
							>
									🥎
							</span>
							<span
								class={styles.buttonDownload}
								onClick={() => (lastClickOn.value = 'Download')}
							>
								⬇️
							</span>
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
