require 'open-uri'
require 'json'
require 'yaml'

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
