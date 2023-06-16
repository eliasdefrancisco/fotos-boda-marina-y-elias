const canvas = document.getElementById('myCanvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

const colors = ['white', 'white', 'yellow', 'white'] // Define los colores aquí
const totalStars = 20 // Define el número total de estrellas aquí
const steps = 10 // Define el número de pasos para el fade in / fade out
const minFadeDuration = 1500 // Define la duración mínima de fade in / fade out
const maxFadeDuration = 3500 // Define la duración máxima de fade in / fade out

// Función para obtener un número aleatorio en un rango
function getRandomInt (min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// Crear las estrellas
for (let i = 0; i < totalStars; i++) {
	let opacity = 0
	let isFadingIn = true
	let x = getRandomInt(0, canvas.width)
	let y = getRandomInt(0, canvas.height)
	const color = colors[getRandomInt(0, colors.length - 1)] // Elegir un color aleatorio
	const totalFadeDuration = getRandomInt(minFadeDuration, maxFadeDuration)
	const stepInterval = totalFadeDuration / steps
	const radio = getRandomInt(0, 1) ? 2 : 1 // Elegir un radio aleatorio
	const diametro = radio * 2 + 1

	// Crear una función para hacer parpadear la estrella
	const fade = function () {
		ctx.clearRect(x - radio, y - radio, diametro, diametro)

		if (isFadingIn) {
			opacity += 0.1
			if (opacity > 1) {
				opacity = 1
				isFadingIn = false
			}
		} else {
			opacity -= 0.1
			if (opacity < 0) {
				opacity = 0
				isFadingIn = true
				x = getRandomInt(0, canvas.width)
				y = getRandomInt(0, canvas.height)
			}
		}

		ctx.globalAlpha = opacity
		ctx.strokeStyle = color

		// Dibujar la cruz
		ctx.beginPath()
		ctx.moveTo(x, y - radio)
		ctx.lineTo(x, y + radio)
		ctx.moveTo(x - radio, y)
		ctx.lineTo(x + radio, y)
		ctx.stroke()

		ctx.globalAlpha = 1 // Reset alpha

		// Recursivamente llamar a la función después de un tiempo aleatorio
		setTimeout(fade, stepInterval)
	}

	// Iniciar el parpadeo
	fade()
}
