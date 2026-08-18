import os
from django.core.exceptions import ValidationError

ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac']
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_file_upload(uploaded_file, allowed_extensions, max_size=MAX_FILE_SIZE):
    """
    Validate file upload: extension + size + content type.
    Usage in model clean() or form.
    """
    if not uploaded_file:
        return

    filename = uploaded_file.name.lower()
    ext = os.path.splitext(filename)[1]

    if ext not in allowed_extensions:
        raise ValidationError(
            f'File type {ext} not allowed. Allowed: {", ".join(allowed_extensions)}'
        )

    if uploaded_file.size > max_size:
        raise ValidationError(
            f'File too large ({uploaded_file.size} bytes). Max: {max_size} bytes (10MB)'
        )

    # Check content type (first bytes / magic numbers for common formats)
    content_type = getattr(uploaded_file, 'content_type', '')
    if content_type:
        allowed_mime_prefixes = {
            'image/': ALLOWED_IMAGE_EXTENSIONS,
            'audio/': ALLOWED_AUDIO_EXTENSIONS,
        }
        for prefix, exts in allowed_mime_prefixes.items():
            if content_type.startswith(prefix):
                if ext not in exts:
                    raise ValidationError(
                        f'Content type {content_type} does not match extension {ext}'
                    )
                break


def validate_image(uploaded_file):
    validate_file_upload(uploaded_file, ALLOWED_IMAGE_EXTENSIONS)


def validate_audio(uploaded_file):
    validate_file_upload(uploaded_file, ALLOWED_AUDIO_EXTENSIONS)
