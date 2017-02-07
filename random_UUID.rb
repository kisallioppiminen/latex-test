# Run in project root folder (/ohtukisalli.github.io)

require 'securerandom'

# Regex pattern for finding exercise divs
regex = /<div class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">/

# Go through every file in folder
Dir.glob('kurssit/**/*.html') do |file|

	# Read file line by line
	File.readlines(file).each do |line|
		
		# If a regex match is found, replace that line 
		if line.match(regex)
			File.write(file, File.read(file).gsub(line, line.match(/^\s+/)[0] + '<div class="tehtava" id="' + SecureRandom.uuid + '">' + "\n"))
		end	
	end	

end

puts "Done!"