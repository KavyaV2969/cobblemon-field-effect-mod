"""Superseded by ai_review.py: the per-lead semantic review of Battle_AI.rb (research/ai-review-decisions.json).

Kept as an entry point so older build scripts regenerate research/ai-coverage.json from the reviewed decisions
instead of the former method-level classification.
"""
from ai_review import main

if __name__ == '__main__':
    main()
