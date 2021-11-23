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

### Userscript manager (recommended)

1. Install a userscript manager, such as [Tampermonkey](https://www.tampermonkey.net/).
2. Open **[{{last_path_segment}}]({{url}})**.
3. Follow the instructions in your userscript manager to install or update.

### Bookmarklet

1. Drag the following link onto your [bookmarks bar](https://www.howtogeek.com/415733/how-to-show-or-hide-the-google-chrome-bookmarks-bar/):
    - **[{{page.title}}](javascript:{{ js_wrapped | url_encode | replace: "+", "%20" }})**
2. Click the newly-created bookmark to run the code.

You'll need to click it again for each page load. Note that you must manually re-install to apply any updates if you use the bookmarklet method.

{% endcapture %}

{{ markdown | markdownify }}

</article>
