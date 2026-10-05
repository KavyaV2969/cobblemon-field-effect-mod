"""Resolve the local Rejuvenation Scripts directory.

source-location.json records the absolute path used when the inventory was
taken. When that path is unavailable (profile moved, or a non-Windows shell),
fall back to the copy kept beside this project and verified by source-hashes.
"""
from pathlib import Path
import json,os
ROOT=Path(__file__).resolve().parents[1]
def scripts():
    override=os.environ.get('REJUVENATION_SCRIPTS')
    recorded=json.loads((ROOT/'research/source-location.json').read_text(encoding='utf-8'))['scripts']
    for candidate in [override,recorded,ROOT.parent/'Rejuvenation 14 copy/Scripts',ROOT/'Rejuvenation 14 copy/Scripts']:
        if candidate and (Path(candidate)/'Battle_Field.rb').is_file():return Path(candidate)
    raise FileNotFoundError('Rejuvenation Scripts directory not found; set REJUVENATION_SCRIPTS')
