regex = /<div class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">/

Dir.glob('**/*.html') do |file|
	ids = Array.new
	File.readlines(file).each do |line|
		if line.match(regex)
			ids.push(line.match(regex)[1])
		end
	end

	duplicates = ids.group_by{|e| e}.keep_if{|_, e| e.length > 1}
	if duplicates.keys.length != 0
		puts "Duplikaatti-ID löydetty tiedostossa:"
		duplicates.keys.each do |key|
		 	puts "'#{key}' tiedostossa '#{file}'"
		end
		puts "\n"
	end

end

puts "Valmis!"