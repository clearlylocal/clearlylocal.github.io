---
title: Userscripts
layout: default
---

<div class="home">
	{%- if page.title -%}
	<h1 class="page-heading">{{ page.title }}</h1>
	{%- endif -%}
	<ul>
		{% for subpage in site.pages %}
			{% assign sub_string_size = page.url | size %}
			{% assign some_string_size = subpage.url | size %}
			{% assign start_index = some_string_size | minus: sub_string_size %}
			{% assign result = subpage.url | slice: 0, sub_string_size %}

    		{% if result == page.url and subpage.url != page.url %}
    			<li><a href="{{ subpage.url }}">{{ subpage.title }}</a></li>
    		{% endif %}
    	{% endfor %}
    </ul>

</div>
