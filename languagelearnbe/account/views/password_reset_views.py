from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from account.models import Account


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    """
    POST /api/auth/forgot-password/
    Body: { "email": "user@example.com" }
    """
    email = request.data.get('email')
    if not email:
        return Response(
            {'error': 'Email là bắt buộc'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = Account.objects.filter(email=email).first()

    if not user:
        return Response(
            {'message': 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu'},
            status=status.HTTP_200_OK
        )

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_link = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"

    try:
        send_mail(
            subject='Đặt lại mật khẩu - LanguageLearn',
            message=f'Nhấn vào link để đặt lại mật khẩu: {reset_link}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=True,
        )
    except Exception:
        pass

    return Response(
        {
            'message': 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu',
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_view(request):
    """
    POST /api/auth/reset-password/
    Body: { "uid": "...", "token": "...", "new_password": "..." }
    """
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not all([uid, token, new_password]):
        return Response(
            {'error': 'uid, token và new_password là bắt buộc'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 8:
        return Response(
            {'error': 'Mật khẩu phải có ít nhất 8 ký tự'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        uid_int = force_str(urlsafe_base64_decode(uid))
        user = Account.objects.get(pk=uid_int)
    except (TypeError, ValueError, OverflowError, Account.DoesNotExist):
        return Response(
            {'error': 'Link đặt lại mật khẩu không hợp lệ'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not default_token_generator.check_token(user, token):
        return Response(
            {'error': 'Link đặt lại mật khẩu đã hết hạn'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {'message': 'Đặt lại mật khẩu thành công'},
        status=status.HTTP_200_OK
    )
