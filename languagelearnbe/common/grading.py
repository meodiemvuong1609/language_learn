def answers_match(expected, given):
    if expected is None or given is None:
        return False
    return str(expected).strip().lower() == str(given).strip().lower()


def normalize_options(options):
    if options is None:
        return {}
    if isinstance(options, dict):
        return options
    if isinstance(options, list):
        letters = "abcdefghijklmnopqrstuvwxyz"
        return {letters[i]: item for i, item in enumerate(options) if i < len(letters)}
    return {}
