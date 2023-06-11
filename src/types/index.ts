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