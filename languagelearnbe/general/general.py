def convert_response(message, status_code, data=None, count=None):
    """Build a standard {message, code, data?, count?} API envelope."""
    response = {
        "message": message,
        "code": status_code,
    }

    if data is not None:
        response["data"] = data
    if count is not None:
        response["count"] = count

    return response
