const STAR_COUNT = 150
const STAR_COLOR_1 = 'white'
const STAR_COLOR_2 = 'yellow'
const STAR_COLOR_3 = 'white'
const STAR_COLOR_4 = 'orange'

const starsContainer = document.querySelector('.stars')

// Genera las estrellas apoyandose en el css
for (let i = 0; i < STAR_COUNT; i++) {
	const star = document.createElement('div')
	star.className = 'star'
	star.style.left = `${Math.random() * 100}%`
	star.style.top = `${Math.random() * 100}%`
	const rand = Math.random()
	if (rand < 0.25) {
		star.style.backgroundColor = STAR_COLOR_1
	} else if (rand < 0.5) {
		star.style.backgroundColor = STAR_COLOR_2
	} else if (rand < 0.75) {
		star.style.backgroundColor = STAR_COLOR_3
	} else {
		star.style.backgroundColor = STAR_COLOR_4
	}
	star.classList.add(`blink-${Math.floor(Math.random() * 20) + 1}`)
	starsContainer.appendChild(star)
}
