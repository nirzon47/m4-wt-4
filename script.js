// Slick carousel
$('.slick-carousel').slick()

// DOM elements
const cards = document.getElementById('cards')
const buttons = document.getElementsByClassName('btn-accent')

const image = document.getElementById('image')
const name = document.getElementById('name')
const brand = document.getElementById('brand')
const storage = document.getElementById('storage')
const display = document.getElementById('display')
const processor = document.getElementById('processor')
const ram = document.getElementById('ram')
const sensors = document.getElementById('sensors')
const released = document.getElementById('released')

const search = document.getElementById('search')
const loading = document.getElementById('loading')
const notFound = document.getElementById('not-found')
const form = document.getElementById('form')

// Variables
let model = []
let len = 0

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	fetchData()
})

search.addEventListener('input', (e) => {
	if (e.target.value) {
		fetchData(e.target.value)
	} else {
		fetchData()
	}
})

form.addEventListener('submit', (e) => {
	e.preventDefault()
})

/**
 * Adds event listeners to all buttons.
 *
 * @param {array} buttons - The array of buttons to add listeners to.
 * @return {undefined} This function does not return a value.
 */
const addBtnListeners = () => {
	Array.from(buttons).forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const id = e.target.parentElement.parentElement.parentElement.id
			fetchDetails(id)
		})
	})
}

// Functions

/**
 * Fetches data from the API based on the provided search term.
 *
 * @param {string} search - The search term to use when fetching data. Defaults to 'iphone'.
 * @return {Promise<void>} - A promise that resolves when the data has been fetched and processed.
 */
const fetchData = async (search = 'iphone') => {
	loading.style.opacity = 1
	cards.style.opacity = 0
	fetch(`https://openapi.programming-hero.com/api/phones?search=${search}`)
		.then((res) => res.json())
		.then((data) => {
			loading.style.opacity = 0
			model = data.data
			len = model.length
			renderData()
			cards.style.opacity = 1
		})
		.catch((err) => console.log(err))
}

/**
 * Renders the data on the page.
 *
 * @return {Promise<void>} This function does not take any parameters and does not return anything.
 */
const renderData = async () => {
	cards.innerHTML = ''

	if (len === 0) {
		notFound.style.opacity = 1
	} else {
		notFound.style.opacity = 0
	}

	let limit = len > 12 ? 12 : len

	renderWithinLimit(0, limit)

	if (len > 12) {
		const showAllBtn = document.createElement('btn')
		showAllBtn.classList.add('btn', 'btn-secondary')
		showAllBtn.innerText = 'Show All'

		showAllBtn.addEventListener('click', () => {
			renderWithinLimit(12, len)

			showAllBtn.remove()
		})

		cards.appendChild(showAllBtn)
	}
}

/**
 * Renders a range of items within a specified limit.
 *
 * @param {number} start - The starting index of the range.
 * @param {number} end - The ending index of the range.
 */
const renderWithinLimit = (start, end) => {
	const fragment = document.createDocumentFragment()

	for (let i = start; i < end; i++) {
		const item = model[i]
		const card = document.createElement('div')
		card.classList.add('card-container')

		card.id = item.slug

		const elements = `
            <figure class="px-10 pt-10">
                <img
                    src="${item.image}"
                    alt="${item.phone_name}"
                    class="rounded-xl"
                />
            </figure>
            <div class="items-center text-center card-body">
                <h2 class="mb-2 card-title">${item.phone_name}</h2>
                <div class="card-actions">
                    <button class="btn btn-accent">
                        See details
                    </button>
                </div>
            </div>
        `

		card.innerHTML = elements
		fragment.appendChild(card)
	}

	cards.appendChild(fragment)
	addBtnListeners()
}

/**
 * Fetches details for a given ID from the openapi.programming-hero.com API.
 *
 * @param {number} id - The ID of the phone to fetch details for.
 * @return {Promise} A promise that resolves to the fetched details.
 */
const fetchDetails = async (id) => {
	fetch(`https://openapi.programming-hero.com/api/phone/${id}`)
		.then((res) => res.json())
		.then((data) => {
			changeModalData(data.data)
			modal.showModal()
		})
		.catch((err) => console.log(err))
}

/**
 * Updates the modal data with the given information.
 *
 * @param {Object} data - The data object containing the information to update the modal.
 * @param {string} data.image - The image source to set for the modal.
 * @param {string} data.name - The name to display in the modal.
 * @param {string} data.brand - The brand to display in the modal.
 * @param {string} data.mainFeatures.storage - The storage information to display in the modal.
 * @param {string} data.mainFeatures.displaySize - The display size information to display in the modal.
 * @param {string} data.mainFeatures.chipSet - The chip set information to display in the modal.
 * @param {string} data.mainFeatures.memory - The memory information to display in the modal.
 * @param {string} data.mainFeatures.sensors - The sensor information to display in the modal.
 * @param {string} data.releaseDate - The release date to display in the modal.
 * @return {undefined} This function does not return any value.
 */
const changeModalData = (data) => {
	image.src = data.image
	name.innerText = data.name
	brand.innerText = data.brand
	storage.innerText = data.mainFeatures.storage
	display.innerText = data.mainFeatures.displaySize
	processor.innerText = data.mainFeatures.chipSet
	ram.innerText = data.mainFeatures.memory
	sensors.innerText = data.mainFeatures.sensors
	released.innerText = data.releaseDate
}
