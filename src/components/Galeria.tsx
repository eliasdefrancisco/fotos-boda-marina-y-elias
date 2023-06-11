import path from 'path'
import { BucketDataJson, imageTypes } from 'src/types'
import styles from './Galeria.module.css'

type Props = {
	bucketData: BucketDataJson
	baseUrl: string
	tipo: typeof imageTypes[keyof typeof imageTypes]
}

export default function Galeria ({ bucketData, baseUrl, tipo }: Props) {
	console.log('bucketData', bucketData)

	const thumbnailUrlBase = tipo === imageTypes.fotocall_gifs
		? path.join(baseUrl, bucketData.urlBaseRelativa)
		: path.join(baseUrl, bucketData.thumbnail.urlBaseRelativa)

	const thumbnailFiles = tipo === imageTypes.fotocall_gifs
		? bucketData.archivos
		: bucketData.thumbnail.archivos

	return (
		<div class={styles.container}>
			<ul class={styles.galeryContainer}>
				{thumbnailFiles.map((imageName, index) => (
					<li key={index}>
						<img
							src={path.join(thumbnailUrlBase, imageName)}
							class={`${styles.image} ${styles[tipo]}`}
							alt={imageName}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}
