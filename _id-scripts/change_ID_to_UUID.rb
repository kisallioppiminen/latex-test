require 'securerandom'

regex = /<div class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">/

Dir.glob('**/*.html') do |file|
	File.readlines(file).each do |line|
		if line.match(regex)
			File.write(file, File.read(file).gsub(line, line.match(/^\s+/)[0] + '<div class="tehtava" id="' + SecureRandom.uuid + '">' + "\n"))
		end	
	end	
end

puts "Valmis!"