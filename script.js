// DOM elements
const cards = document.getElementById('cards')
const buttons = document.getElementsByClassName('btn-accent')

// Variables
let model = []

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	fetchData()
})

const addBtnListener = () => {
	Array.from(buttons).forEach((btn) => {
		const id = btn.parentElement.parentElement.parentElement.id
		const modal = document.getElementById(`modal_${id}`)
		btn.addEventListener('click', () => {
			modal.showModal()
		})
	})
}

const renderData = async () => {
	console.log(model)
	const fragment = document.createDocumentFragment()
	cards.innerHTML = ''

	model.forEach((item) => {
		const card = document.createElement('div')
		card.classList.add('card-container')
		let id
		for (let i = item.slug.length - 1; i >= 0; i--) {
			if (item.slug[i] === '-') {
				id = item.slug.slice(i + 1)
				break
			}
		}

		card.id = id

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
                <button class="btn btn-accent" onclick="modal_${id}.showModal()">
                    See details
                </button>
                <dialog id="modal_${id}" class="modal">
                    <div class="modal-box">
                        <h3 class="text-lg font-bold">${item.phone_name}</h3>
                        <div class="flex flex-col gap-1 font-semibold text-left">
                            <p class="pt-4">
                                Brand: <span class="font-normal">${item.brand}</span>
                            </p>
                            <p>
                                Storage:
                                <span class="font-normal"
                                    >128GB/256GB/1TB storage, no card slot</span
                                >
                            </p>
                            <p>
                                Display:
                                <span class="font-normal"
                                    >6.7 inches, 109.8 cm2 (~87.4% screen-to-body
                                    ratio)</span
                                >
                            </p>
                            <p>
                                Processor:
                                <span class="font-normal">Apple A15 Bionic (5 nm)</span>
                            </p>
                            <p>
                                RAM:
                                <span class="font-normal"
                                    >128GB 6GB RAM, 256GB 6GB RAM, 512GB 6GB RAM, 1TB 6GB
                                    RAM</span
                                >
                            </p>
                            <p>
                                Sensors:
                                <span class="font-normal">
                                    Face ID, Accelerometer, Gyro, Proximity, Compass,
                                    Barometer
                                </span>
                            </p>
                            <p class="pb-4 text-center">Released 2021, September 24</p>
                        </div>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>`

		card.innerHTML = elements
		fragment.appendChild(card)
	})

	cards.appendChild(fragment)
	addBtnListener()
}

const fetchData = async (search = 'iphone') => {
	fetch(`https://openapi.programming-hero.com/api/phones?search=${search}`)
		.then((res) => res.json())
		.then((data) => {
			model = data.data
			renderData()
		})
		.catch((err) => console.log(err))
}
