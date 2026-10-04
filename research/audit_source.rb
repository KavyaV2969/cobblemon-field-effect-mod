require 'json'
require 'prism'
require 'digest'
source = ARGV.fetch(0).tr('\\','/')
out = ARGV.fetch(1)
fields = JSON.parse(File.read(File.join(out,'field-id-map.json'))).keys
records = []
field_symbols = lambda do |text|
  found = text.scan(/:([A-Z][A-Z0-9]+)/).flatten & fields
  found |= fields.grep(/^FLOWERGARDEN/) if text.include?('PBFields::FLOWERGARDEN')
  found |= fields.grep(/^CONCERT/) if text.include?('PBFields::CONCERT')
  found
end
# A source method may assign a field list before testing its local variable.
# These are additional review leads, never proof that a rule exists or works.
find_aliases = nil
find_aliases = lambda do |node, aliases, root = true|
  return if !root && node.is_a?(Prism::DefNode)
  if node.respond_to?(:name) && node.respond_to?(:value) && node.class.name.match?(/(?:LocalVariable|Constant).*WriteNode$/)
    found = field_symbols.call(node.value&.slice.to_s)
    aliases[node.name.to_s] = (aliases[node.name.to_s] || []) | found unless found.empty?
  end
  node.compact_child_nodes.each { |child| find_aliases.call(child, aliases, false) }
end
walk = nil
walk = lambda do |node, file, aliases = {}|
  return unless node
  if node.is_a?(Prism::DefNode)
    aliases = {}
    find_aliases.call(node, aliases)
  end
  predicates = []
  if node.is_a?(Prism::IfNode) || node.is_a?(Prism::UnlessNode)
    predicates << [node.predicate, node.statements] if node.predicate.slice.match?(/\bFE\b|\bOV\b|field\.(?:effect|counter|duration|overlay)|ProgressiveField|PBFields::/) || (file == 'Battle_Field.rb' && node.predicate.slice.match?(/@effect|@overlay/))
  elsif node.is_a?(Prism::CaseNode) && node.predicate && (node.predicate.slice.match?(/\bFE\b|\bOV\b|field\.effect/) || (file == 'Battle_Field.rb' && node.predicate.slice.match?(/@effect|@overlay/)))
    node.conditions.each { |w| predicates << [w, w.statements] if w.is_a?(Prism::WhenNode) }
  end
  predicates.each do |predicate, statements|
    condition = predicate.is_a?(Prism::WhenNode) ? predicate.conditions.map(&:slice).join(', ') : predicate.slice
    associated = field_symbols.call(condition)
    aliases.each { |name, values| associated |= values if condition.match?(/\b#{Regexp.escape(name)}\b/) }
    next if associated.empty?
    body = statements&.slice.to_s
    categories = {
      'stats' => /pbChangeStats|calc(?:attack|defense|spatk|spdef)|speed \*=|pbCanIncrease|pbCanReduce/,
      'damage' => /basemult|atkmult|defmult|pbReduceHP|Damage|damage/,
      'accuracy' => /accuracy|accmult|evastage/,
      'type' => /changeType|type =|typemod|hasType|Mimicry/,
      'transition' => /setField|breakField|growField|reduceField|endTempField|field\.counter/,
      'status' => /pbPoison|pbBurn|pbFreeze|pbConfuse|pbCureStatus|status/,
      'healing' => /pbRecoverHP|Heal|heal|Wish/,
      'ability' => /ability|Ability|abilities/,
      'item' => /item|Item|seed/,
      'weather' => /weather|Weather|SUNNYDAY|RAINDANCE|HAIL|SNOW/,
      'message' => /pbDisplay|pbAbilityBoxAndDisplay/,
      'move_behavior' => /effects\[|move|Move|function/,
      'form' => /form|species|Species/,
      'priority' => /priority|pri \+=|pri -=/,
    }.filter_map { |k,v| k if body.match?(v) }
    records << {file: file, line: predicate.location.start_line, end_line: node.location.end_line,
      condition: condition, fields: associated, categories: categories,
      body_sha256: Digest::SHA256.hexdigest(body), status: 'requires_behavioral_comparison'}
  end
  node.compact_child_nodes.each { |child| walk.call(child,file,aliases) }
end
Dir.glob(File.join(source,'**/*.rb')).each do |file|
  next if file.include?('/Definitions/') && !file.end_with?('fieldtext.rb')
  parsed = Prism.parse_file(file)
  walk.call(parsed.value, file.delete_prefix(source+'/'))
end
File.write(File.join(out,'interaction-audit.json'),JSON.pretty_generate(records))
class FEData; end
compiled_file = File.join(source,'../Data/fields.dat')
compiled = Marshal.load(File.binread(compiled_file))
compiled_summary = compiled.filter_map do |key,obj|
  next unless key.is_a?(Symbol)
  [key, obj.instance_variables.to_h { |var| [var.to_s.delete_prefix('@'), obj.instance_variable_get(var)] }]
end.to_h
File.write(File.join(out,'compiled-field-specification.json'),JSON.pretty_generate(compiled_summary))
puts "#{records.length} AST field-condition blocks; #{compiled_summary.length} compiled field entries"
