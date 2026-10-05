# Execute the original Battle_AI.rb strategy methods (not copies) on synthetic matchups, so the generated
# JavaScript ports can be compared value for value. Input/outputs are JSON on stdin/stdout; nothing is packaged.
#   getFieldDisruptScore  - field preference of a matchup (research/ai-disruption-source.json)
#   switch-in affinity    - the `case @battle.FE` fieldscore table of getSwitchInScoresParty
require 'json'
require 'ostruct'
source = File.join(ARGV.fetch(0), 'Battle_AI.rb')
lines = File.read(source, encoding: 'utf-8').split("\n")

Overlays = true unless defined?(Overlays)
Rejuv = true unless defined?(Rejuv)
module PBStuff
  SEMIINVULMOVE = [:BOUNCE, :DIG, :DIVE, :FLY, :PHANTOMFORCE, :SHADOWFORCE, :SKYDROP]
  LevitateAbilities = [:LEVITATE, :EELEVATE, :SOLARIDOL, :LUNARIDOL, :GRAVITYCONTROL]
  UnnerveAbilities = [:UNNERVE, :ASONECHILLING, :ASONEGRIM]
end
# Only the Water row of the type chart is read by the affinity table (Water Surface/Underwater weaknesses).
module PBTypes
  WATER = { FIRE: 2.0, GROUND: 2.0, ROCK: 2.0, WATER: 0.5, GRASS: 0.5, DRAGON: 0.5 }
  def self.typesEff(attack, types, inverse: false)
    raise "unexpected attacking type #{attack}" unless attack == :WATER
    value = types.map { |t| WATER.fetch(t, 1.0) }.reduce(1.0, :*)
    OpenStruct.new(multiplier: value, superEffective?: value > 1)
  end
end
module PBStats; ATTACK = 1; DEFENSE = 2; SPATK = 3; SPDEF = 4; SPEED = 5; ACCURACY = 6; EVASION = 7; end
module PBFields
  CONCERT = [:CONCERT1, :CONCERT2, :CONCERT3, :CONCERT4]
  FLOWERGARDEN = [:FLOWERGARDEN1, :FLOWERGARDEN2, :FLOWERGARDEN3, :FLOWERGARDEN4, :FLOWERGARDEN5]
end

class OracleMon
  attr_reader :ability, :attack, :spatk, :spdef, :defense, :hp, :totalhp, :effects, :stages, :item, :crested, :form, :types
  def initialize(view, partner = nil, reserves = 0)
    view ||= {}
    @types = (view['types'] || []).map { |t| t.upcase.to_sym }
    @ability = view['ability'] && view['ability'].upcase.to_sym
    @attack, @spatk, @spdef, @defense = view['atk'] || 1, view['spa'] || 1, view['spd'] || 1, view['def'] || 1
    @speed, @hp, @totalhp = view['speed'] || 1, view['hp'] || 0, view['maxhp'] || 1
    @moves = (view['moves'] || []).map { |m| m.upcase.to_sym }
    @airborne = !!view['airborne']
    @effects = { Protect: !!view['protect'], SkyDrop: !!view['skyDrop'], TwoTurnAttack: view['semiInvulnerable'] ? :FLY : 0 }
    @stages = Hash.new(0)
    @partner, @reserves, @roles = partner, reserves, (view['roles'] || []).map(&:to_sym)
    @crested, @form, @item = nil, 0, nil
  end
  attr_reader :roles
  def hasType?(type); @types.include?(type); end
  def pbPartner; @partner || OracleMon.new(nil); end
  def pbSpeed; @speed; end
  def isAirborne?; @airborne; end
  def pbHasMove?(*moves); moves.any? { |m| @moves.include?(m) }; end
  def moves; @moves.map { |m| OpenStruct.new(move: m) }; end
  def pbNonActivePokemonCount; @reserves; end
end

class OracleAI
  BESTSKILL = 100 # Battle_AI.rb:62; the ports model the best-skill AI
  def initialize(view, field, overlay)
    @attacker = OracleMon.new(view['attacker'], view['attackerPartner'] && OracleMon.new(view['attackerPartner']))
    @opponent = OracleMon.new(view['opponent'], view['opponentPartner'] && OracleMon.new(view['opponentPartner']), view['opponentReserves'] || 0)
    weather = view['weather'].to_s.empty? ? 0 : view['weather'].upcase.to_sym
    counter = view['counter'] || 0
    @battle = OpenStruct.new(FE: field.to_sym, OV: overlay ? field.to_sym : nil, field: OpenStruct.new(counter: counter), doublebattle: !!view['doubles'])
    @battle.define_singleton_method(:pbWeather) { |_mon| weather }
    @battle.define_singleton_method(:weather) { weather }
    @battle.define_singleton_method(:inverse?) { false }
    @battle.define_singleton_method(:ProgressiveFieldCheck) do |fields, first = 1, last = fields.length|
      index = fields.index(self.FE)
      !index.nil? && index + 1 >= first && index + 1 <= last
    end
    @party_types = (view['partyTypes'] || []).map { |t| t.upcase.to_sym }
    @faster = !!view['attackerFaster']
    @mondata = OpenStruct.new(oppitemworks: false, skill: 100)
  end
  def pbGetMonRoles(mon); mon.roles; end
  def getAIMemory(battler); battler.moves; end
  def checkAImoves(moves, memory = nil); (memory || getAIMemory(@opponent)).map(&:move).intersect?(moves); end
  def pbPartyHasType?(type, _index = nil); @party_types.include?(type); end
  def pbAIfaster?(*_args); @faster; end
  def accuracyWeatherAbilityActive?(*_args); false; end
end

# The disruption method, defined from its exact source text.
start = lines.index { |l| l.strip.start_with?('def getFieldDisruptScore(') }
stop = (start + 1...lines.length).find { |i| lines[i] =~ /\A  def / }
OracleAI.class_eval(lines[start...stop].join("\n"), source, start + 1)

# The switch-in affinity table, wrapped in a method around its exact source text.
first = lines.index { |l| l.strip == 'fieldscore = 0' }
last = (first...lines.length).find { |i| lines[i].strip == 'monscore += fieldscore' }
OracleAI.class_eval("def oracleAffinity(i, nonmegaform)\n" + lines[first...last].join("\n") + "\nfieldscore\nend", source, first)

input = JSON.parse(STDIN.read)
disruption = input.fetch('disruption', []).map do |row|
  ai = OracleAI.new(row['view'], row['field'], row['overlay'])
  attacker, opponent = ai.instance_variable_get(:@attacker), ai.instance_variable_get(:@opponent)
  ai.getFieldDisruptScore(attacker, opponent, row['field'].to_sym, !!row['violent'], tempOnly: !!row['overlay'])
end
affinity = input.fetch('affinity', []).map do |row|
  ai = OracleAI.new(row['view'], row['field'], false)
  mon = OracleMon.new(row['mon'])
  base = OracleMon.new(row['base'] || row['mon'])
  ai.oracleAffinity(mon, base)
end
puts JSON.generate({ disruption: disruption, affinity: affinity })
