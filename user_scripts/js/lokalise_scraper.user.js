// ==UserScript==
// @name         Lokalise Scraper
// @namespace    https://www.clearlyloc.com/
// @version      0.1
// @description  Scrape Lokalise strings
// @author       lionel.rowe@clearlyloc.com
// @match        https://*.lokalise.com/*
// @icon         https://www.clearlyloc.com/favicon/favicon-32x32.png?v=8jMmgN8eLE
// @grant        none
// @updateURL    https://clearlylocal.github.io/user_scripts/js/lokalise_scraper.user.js
// @downloadURL  https://clearlylocal.github.io/user_scripts/js/lokalise_scraper.user.js
// ==/UserScript==

const running = Symbol('running')

const __main__ = async () => {
	if (window[running]) return

	window[running] = true

	const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

	const toggle = document.querySelector('.editor-toggle-ph-wrapping')

	let wasToggledOn

	if (toggle.classList.contains('active')) {
		toggle.click()
		wasToggledOn = true
	}

	let arr = []

	const selectorForLang = (langIso) => {
		const id = Object.entries(window.lang_to_id).find(
			([k, v]) => v.lang_iso === langIso,
		)[0]

		return `[data-to-lang="${id}"] .lokalise-editor-wrapper`
	}

	let lastArrLength = -1

	window.scrollTo(0, 0)

	while (true) {
		await sleep(1000)

		const selector = '#endless .row-key.row'

		arr = [...new Set([...arr, ...document.querySelectorAll(selector)])]

		if (arr.length === lastArrLength) break

		lastArrLength = arr.length

		window.scrollTo(0, window.scrollY + 1e4)
	}

	const res = arr.map((x) =>
		Object.fromEntries([
			['key', x.querySelector('[class*="key-name"]')?.textContent.trim()],
			...['zh_CN', 'en'].map((lang) => [
				lang,
				x.querySelector(selectorForLang(lang))?.textContent.trim(),
			]),
		]),
	)

	if (wasToggledOn) {
		toggle.click()
	}

	const pre = document.createElement('pre')

	pre.style = `position: fixed; z-index: ${Number.MAX_SAFE_INTEGER}; inset:0; white-space: pre-wrap; tab-size: 4; user-select: all`
	pre.textContent = JSON.stringify(res, null, '\t')

	document.body.appendChild(pre)

	const cancelOnEsc = (e) => {
		if (e.key === 'Escape') {
			window.removeEventListener('keydown', cancelOnEsc)
			pre.remove()

			window[running] = false
		}
	}

	window.addEventListener('keydown', cancelOnEsc)
}

const runOnCtrlAltS = (e) => {
	if (e.ctrlKey && e.metaKey && e.key === 's') {
		__main__()
	}
}

window.addEventListener('keydown', runOnCtrlAltS)
