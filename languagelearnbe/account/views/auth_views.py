from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status
from account.models import Account
from account.serializers import AccountSerializer
from general.general import convert_response


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response(
                convert_response("Username, password is required", 400),
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = Account.objects.get(username=username)

            if user.check_password(password):
                token, created = Token.objects.get_or_create(user=user)
                return Response(
                    convert_response("Success", 200, token.key),
                    status=status.HTTP_200_OK
                )
            return Response(
                convert_response("Invalid password", 400),
                status=status.HTTP_400_BAD_REQUEST
            )
        except Account.DoesNotExist:
            return Response(
                convert_response("Invalid username", 400),
                status=status.HTTP_400_BAD_REQUEST
            )


class GetMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = AccountSerializer(request.user)
        return Response(
            convert_response("Success", 200, serializer.data),
            status=status.HTTP_200_OK
        )

    def patch(self, request):
        serializer = AccountSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                convert_response("Success", 200, serializer.data),
                status=status.HTTP_200_OK
            )
        return Response(
            convert_response("Invalid data", 400, serializer.errors),
            status=status.HTTP_400_BAD_REQUEST
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(
            convert_response("Logged out", 200),
            status=status.HTTP_200_OK
        )
