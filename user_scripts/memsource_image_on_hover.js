const extensions = ['jpg', 'jpeg', 'jp2', 'png', 'webp', 'gif', 'svg']
const container = document.createElement('div')
const img = document.createElement('img')

container.style.cssText = Object.entries({
	position: 'fixed',
	border: '1px solid #ddd',
	filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))',
	margin: '0',
	'box-sizing': 'border-box',
	padding: '0',
	'pointer-events': 'none',
	'z-index': Number.MAX_SAFE_INTEGER,
	background: 'aquamarine',
})
	.map(([k, v]) => `${k}: ${v} !important;`)
	.join(' ')

container.appendChild(img)

container.insertAdjacentHTML(
	'beforeend',
	`<div style="text-align: right; padding: 2px 5px;">
		<small>Press <kbd>Esc</kbd> to close</small>
	</div>`,
)

const brokenImages = new Set()

const attachListeners = (window) => {
	function hoverHandler(e) {
		if (
			!(e.target instanceof window.HTMLElement) ||
			e.target.childNodes.length !== 1
		) {
			return
		}

		const pattern = {
			test: (str) => extensions.includes(str.split('.').slice(-1)[0]),
		}

		const segments =
			e.target instanceof window.HTMLAnchorElement
				? [e.target.href]
				: (e.target.textContent ?? '').split(/[.?!]?(?:\s+|$)/)

		const m = segments.find((x) => {
			try {
				return pattern.test(x)
			} catch {
				return false
			}
		})

		if (m && !brokenImages.has(m)) {
			img.src = m

			img.onload = () => {
				document.body.appendChild(container)

				container.dataset.width = img.width.toString()
				container.dataset.height = img.height.toString()
			}

			img.onerror = () => {
				brokenImages.add(m)

				container.remove()
			}
		} else {
			container.remove()
		}

		mouseMoveHandler(e)
	}

	function mouseMoveHandler(e) {
		if (
			!(e.target instanceof window.HTMLElement) ||
			e.target.childNodes.length !== 1
		) {
			return
		}

		const { width, height } = container.dataset

		if (width == null || height == null) return

		container.style.top = '0'
		container.style.right = '0'
	}

	const escHandler = (e) => {
		if (e instanceof window.FocusEvent || e.key === 'Escape') {
			container.remove()
		}
	}

	window.document.body.addEventListener('mouseover', hoverHandler)
	window.document.body.addEventListener('mousemove', mouseMoveHandler)

	window.addEventListener('keydown', escHandler)
	window.addEventListener('blur', escHandler, true)
}

const frames = new Set([
	window,
	...[...document.querySelectorAll('iframe')].map((x) => x.contentWindow),
	...Array.from(window.frames),
])

for (const frame of frames) {
	try {
		attachListeners(frame)
	} catch {
		// ignore cross-origin isues etc
	}
}
