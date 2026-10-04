require 'json'
source = ARGV.fetch(0)
Rejuv = true
Reborn = false
Gen = 9.5
Champs = 9.5
# Only load constants and definition data, never the game runtime.
load File.join(source, 'PBConstants.rb')
load File.join(source, 'PBStuff.rb')
load File.join(source, 'Rejuv/Definitions/fieldtext.rb')
def portable(value)
  case value
  when Hash then value.map { |k,v| [portable(k), portable(v)] }
  when Array then value.map { |v| portable(v) }
  when Symbol then value.to_s
  else value
  end
end
File.write(ARGV.fetch(1), JSON.pretty_generate(FIELDEFFECTS.transform_values { |v| portable(v) }))
puts "Extracted #{FIELDEFFECTS.length} definitions"
