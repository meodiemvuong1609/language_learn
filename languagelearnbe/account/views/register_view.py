from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from account.models import Account
from account.serializers import AccountSerializer
from general.general import convert_response


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Đăng ký tài khoản mới.
    Body: { username, email, password, phone (optional), full_name (optional) }
    """

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        phone = request.data.get("phone", "")
        full_name = request.data.get("full_name", "")

        if not username or not email or not password:
            return Response(
                convert_response("Username, email and password are required", 400),
                status=status.HTTP_400_BAD_REQUEST
            )

        if Account.objects.filter(username=username).exists():
            return Response(
                convert_response("Username already exists", 400),
                status=status.HTTP_400_BAD_REQUEST
            )

        if Account.objects.filter(email=email).exists():
            return Response(
                convert_response("Email already exists", 400),
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 8:
            return Response(
                convert_response("Password must be at least 8 characters", 400),
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = Account.objects.create_user(
                username=username,
                email=email,
                password=password,
                phone=phone,
                full_name=full_name,
                role=Account.ROLE_STUDENT,
                status=Account.STATUS_PENDING,
            )
            serializer = AccountSerializer(user)
            return Response(
                convert_response("Registration successful", 200, serializer.data),
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                convert_response(f"Registration failed: {str(e)}", 400),
                status=status.HTTP_400_BAD_REQUEST
            )
