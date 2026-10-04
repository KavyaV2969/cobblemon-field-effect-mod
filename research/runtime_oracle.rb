# Execute the original local methods without copying or packaging game scripts.
# The input describes only the dependencies of the methods under comparison.
require 'json'
require 'ostruct'
source = ARGV.fetch(0)
load File.join(source, 'Battle_Field.rb')
class PokeBattle_Battler
  attr_reader :ability
  def initialize(battle, types, ability, airborne)
    @battle, @oracle_types, @ability, @oracle_airborne = battle, types.map(&:to_sym), ability&.to_sym, airborne
  end
  def hasType?(type); @oracle_types.include?(type); end
  def isAirborne?; @oracle_airborne; end
end
class OracleBattle
  attr_reader :FE
  def initialize(field, weather, suppressed)
    @FE, @oracle_weather, @oracle_suppressed = field.to_sym, weather&.to_sym || 0, suppressed
  end
  def pbWeather(attacker)
    return :SUNNYDAY if attacker&.ability == :MEGASOL
    return 0 if @oracle_suppressed
    @oracle_weather
  end
  def isOnline?; @online; end
  attr_writer :online
end
input=JSON.parse(STDIN.read)
output=input.fetch('defense').map do |field, types, ability, airborne, weather, attacker_ability, suppressed, category|
  battle=OracleBattle.new(field,weather,suppressed)
  attacker=PokeBattle_Battler.new(battle,[],attacker_ability,false)
  PokeBattle_Battler.new(battle,types,ability,airborne).fieldDefenseBoost(attacker,category.to_sym)
end
output_modes=input.fetch('multipliers').map do |value,mode,frenzy,online|
  battle=OracleBattle.new(:INDOOR,nil,false);battle.online=online
  move=PokeBattle_Move.allocate;move.instance_variable_set(:@battle,battle)
  $game_variables={DifficultyModes:mode};$game_switches={FieldFrenzy:frenzy}
  move.calculateFieldMultiplier(value)
end
puts JSON.generate({defense:output,multipliers:output_modes})
