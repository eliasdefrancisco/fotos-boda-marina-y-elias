import styles from './Galeria.module.css'

type Props = {
	baseUrl: string;
	imageList: string[];
}

export default function Galeria ({ baseUrl, imageList }: Props) {
	return (
		<div class={styles.container}>
			<ul class={styles.galeryContainer}>
				{imageList.map((foto, index) => (
					<li key={index}>
						<img
							src={`${baseUrl}/${foto}`}
							class={styles.image}
							alt={foto}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}