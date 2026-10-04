require 'json'
Rejuv = true
Reborn = false
Gen = 9.5
Champs = 9.5
source = ARGV.fetch(0)
load File.join(source, 'PBConstants.rb')
load File.join(source, 'PBStuff.rb')
load File.join(source, 'Rejuv/Definitions/movetext.rb')
registry = JSON.parse(File.read(ARGV.fetch(1)))['moves']
# Export only the identifiers/power predicates needed by field calling behavior.
# No descriptions, animations, or unrelated game definitions are copied.
ordinary = MOVEHASH.filter_map do |symbol, data|
  key = symbol.to_s.downcase
  next unless registry.include?(key)
  next if PBStuff::BLACKLISTS[:METRONOME].include?(symbol)
  next if data[:type] == :SHADOW || data[:basedamage].to_i < 70
  key
end
File.write(ARGV.fetch(2), JSON.pretty_generate({'glitchMetronome' => ordinary}))
puts "#{ordinary.length} ordinary source-eligible Glitch Metronome moves"
