import path from 'path'
import { BucketDataJson } from 'src/types'
import styles from './Galeria.module.css'

type Props = {
	bucketData: BucketDataJson
	baseUrl: string
}

export default function Galeria ({ bucketData, baseUrl }: Props) {
	const thumbnailUrlBase = path.join(baseUrl, bucketData.thumbnail.urlBaseRelativa)
	const thumbnailFiles = bucketData.thumbnail.archivos

	return (
		<div class={styles.container}>
			<ul class={styles.galeryContainer}>
				{thumbnailFiles.map((imageName, index) => (
					<li key={index}>
						<img
							src={path.join(thumbnailUrlBase, imageName)}
							class={styles.image}
							alt={imageName}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}
