---
layout: default
---

<article class="post">

<header class="post-header">
	<h1 class="page-heading">Userscript: {{ page.title }}</h1>
</header>

{% assign url_plain = page.path
	| split: "/"
	| last
	| replace: ".md", ".js"
	| relative_url
%}

{% assign last_path_segment_bare = page.url
	| split: "/"
	| last
%}

{% assign last_path_segment = last_path_segment_bare
	| append: ".user.js"
%}

{% assign user_script_path = last_path_segment
	| prepend: "js/"
%}

{% assign url = page.url
	| replace: last_path_segment_bare, user_script_path
	| relative_url
%}

{% capture js %}{% include_relative {{ url_plain }} %}{% endcapture %}

{% capture js_wrapped %}{% include bookmarklet.txt content=js %}{% endcapture %}

{% capture markdown %}

> {{ page.description }}

{{ content }}

## Installation

There are two options for installation: userscript manager (recommended) or bookmarklet.

<details markdown="1" open>

<summary markdown="1">

### Userscript manager (recommended)

</summary>

1. Install a userscript manager, such as [Tampermonkey](https://www.tampermonkey.net/).
2. Restart your browser and re-open this page.
3. Open **[{{last_path_segment}}]({{url}})**.
4. Click "Install", "Update", or "Reinstall", or otherwise follow the instructions in your userscript manager as required.

</details>

<details markdown="1">

<summary markdown="1">

### Bookmarklet

</summary>

1. Drag the following link onto your [bookmarks bar](https://www.howtogeek.com/415733/how-to-show-or-hide-the-google-chrome-bookmarks-bar/):
    - **[{{page.title}}](javascript:{{ js_wrapped | url_encode | replace: "+", "%20" }})**
2. Click the newly-created bookmark to run the code.

You'll need to click it again for each page load. Note that you must manually re-install to apply any updates if you use the bookmarklet method.

</details>

{% endcapture %}

{{ markdown | markdownify }}

</article>

<script>
document.body.addEventListener('click', e => {
	const d = e.target.closest('details')

	if (d) {
		const prevState = d.open

		for (const el of document.querySelectorAll('details')) {
			if (el !== d) {
				el.open = false
			}

			// else handled natively
		}
	}
})
</script>
