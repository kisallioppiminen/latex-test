# Gemfile as of quided at  http://jekyllrb.com/docs/github-pages/
source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'rake'
gem 'github-pages', versions['github-pages']
gem 'html-proofer'
gem 'jekyll-github-metadata'
