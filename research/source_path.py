"""Locate the original Pokémon Rejuvenation 14 installation, which is *never* part of this repository.

Order: $REJUVENATION_SCRIPTS (the Scripts folder itself), $REJUVENATION_REFERENCE/Scripts, a `Rejuvenation 14 copy/Scripts` folder inside the
repository or beside it. The tools that need it (field generation from source, the Ruby oracles, the source-lead review) fail with a clear
message when it is absent; the ordinary build, the packs and every other test do not need it.
"""
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]


def candidates():
    reference = os.environ.get('REJUVENATION_REFERENCE')
    return [os.environ.get('REJUVENATION_SCRIPTS'), reference and Path(reference) / 'Scripts',
            ROOT / 'Rejuvenation 14 copy/Scripts', ROOT.parent / 'Rejuvenation 14 copy/Scripts']


def reference_root():
    """The folder that holds Graphics/ and Scripts/, or None."""
    for candidate in candidates():
        if candidate and (Path(candidate) / 'Battle_Field.rb').is_file(): return Path(candidate).parent
    return None


def available():
    return reference_root() is not None


def scripts():
    root = reference_root()
    if root is None: raise FileNotFoundError('The original Rejuvenation scripts were not found; set REJUVENATION_REFERENCE to the Rejuvenation 14 folder (the one containing Scripts/)')
    return root / 'Scripts'
