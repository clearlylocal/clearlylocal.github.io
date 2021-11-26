require 'open-uri'
require 'json'
require 'yaml'

def config
	c = File.open("./_config.yml").read

	YAML.load(c)
end

task :build do
	Rake::Task["populate"].invoke
	Rake::Task["user_scripts"].invoke
end

task :populate do
	org = 'clearlylocal'

	url = URI("https://api.github.com/orgs/#{org}/repos")

	json = URI.open(url, {
		'Accept' => 'application/vnd.github.v3+json'
	}).read

	data = JSON.parse(json)

	data = data
		.reject { |x| x['name'] == "#{org}.github.io" }
		.map do |x|
			{
				'title' => x['name'],
				'description' => x['description'],
				'repo_url' => x['html_url'],
				'pages_url' => x['has_pages'] ? "https://#{org}.github.io/#{x['name']}" : nil,
				'updated_at' => x['updated_at']
			}
		end

	File.open('./_data/repos.yml', 'w') do |f|
		f.write(
			YAML.dump(
				data
			)
		)
	end
end

def fmt(k, v)
	["// @#{k == 'title' ? 'name' : k}".ljust(16, ' '), v].join ' '
end

task :user_scripts do
	dir = './userscripts'

	scripts = Dir.entries(dir)
		.filter { |x| x =~ /[^.]/ }
		.filter { |x| x.end_with? '.js' }
		.reject { |x| x.end_with? '.user.js' }

	scripts.each do |file_name|
		permalink = file_name.gsub(/\.js$/, '')

		out_path = "#{dir}/js/#{permalink}.user.js"

		js = File.open("#{dir}/#{file_name}").read
		md = File.open("#{dir}/#{permalink}.md").read

		front_matter = /---([\s\S]+)---/.match md

		data = YAML.load(front_matter[1])

		data['downloadURL'] = data['updateURL'] = URI.join(config["url"] , out_path)

		inner = data.to_a.map do |x|
			k = x.first
			v = x.last

			v.kind_of?(Array) ?
				v.map { |v| fmt(k, v) } .join("\n") :
				fmt(k, v)
		end
			.to_a
			.join "\n"

		start = "// ==UserScript=="
		ender = "// ==/UserScript=="

		info = [start, inner, ender].join "\n"

		# re = Regexp.new "#{Regexp.escape start}[\\s\\S]+#{Regexp.escape ender}|^"

		out = [info, js].join "\n\n"

		File.open(out_path, 'w') do |f|
			f.write(out)
		end

		File.chmod(0000, out_path)
	end
end
