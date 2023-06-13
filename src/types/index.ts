type BucketLevelJson = {
	urlBaseRelativa: string
	archivos: string[]
}

export type BucketDataJson = {
	urlBaseRelativa?: string
	archivos?: string[]
	original?: BucketLevelJson
	thumbnail?: BucketLevelJson
	visualizacion?: BucketLevelJson
}

export const imageTypes = {
	fotos: 'fotos',
	fotocall: 'fotocall',
	fotocall_printed: 'fotocall_printed',
	fotocall_gifs: 'fotocall_gifs'
}

export const imageTailNames = {
	thumbnail: '_512',
	visualizacion: '_1024'
}

export const imageDirectoryNames = {
	original: 'original',
	thumbnail: 'thumbnail',
	visualizacion: 'visualizacion'
}
