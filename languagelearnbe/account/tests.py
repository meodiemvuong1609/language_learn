from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

Account = get_user_model()


class AccountAPITest(TestCase):
    """Test các endpoint auth: register, login, forgot-password, reset-password, get-me."""

    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
        )

    # ------------------- Register -------------------
    def test_register_success(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpassword123',
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertEqual(response.data['data']['username'], 'newuser')
        user = Account.objects.get(username='newuser')
        self.assertEqual(user.role, Account.ROLE_STUDENT)
        self.assertEqual(user.status, Account.STATUS_PENDING)

    def test_register_duplicate_username(self):
        Account.objects.create_user(username='dup', email='dup@example.com', password='pass123')
        data = {
            'username': 'dup',
            'email': 'dup2@example.com',
            'password': 'pass123',
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_register_duplicate_email(self):
        Account.objects.create_user(username='dup2', email='dup2@example.com', password='pass123')
        data = {
            'username': 'unique',
            'email': 'dup2@example.com',
            'password': 'pass123',
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_register_short_password(self):
        data = {
            'username': 'shortpw',
            'email': 'short@example.com',
            'password': '123',
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_register_missing_fields(self):
        response = self.client.post('/api/auth/register/', {}, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    # ------------------- Login -------------------
    def test_login_success(self):
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_login_wrong_password(self):
        data = {'username': 'testuser', 'password': 'wrongpass'}
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_login_nonexistent_user(self):
        data = {'username': 'nouser', 'password': 'pass123'}
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    # ------------------- Get Me -------------------
    def test_get_me_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['username'], 'testuser')

    def test_get_me_unauthenticated(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ------------------- Forgot Password -------------------
    def test_forgot_password_existing_email(self):
        response = self.client.post('/api/auth/forgot-password/', {'email': 'test@example.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('token', response.data)
        self.assertNotIn('uid', response.data)
        self.assertNotIn('reset_link', response.data)

    def test_logout_revokes_token(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_me(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch('/api/auth/me/', {'full_name': 'New Name'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['full_name'], 'New Name')

    def test_forgot_password_nonexistent_email(self):
        response = self.client.post('/api/auth/forgot-password/', {'email': 'nonexist@example.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Không reveal rằng email không tồn tại
        self.assertNotIn('token', response.data)

    def test_forgot_password_missing_email(self):
        response = self.client.post('/api/auth/forgot-password/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['code'], status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Email is required')

    # ------------------- Reset Password -------------------
    def test_reset_password_valid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        response = self.client.post('/api/auth/reset-password/', {
            'uid': uid,
            'token': token,
            'new_password': 'newpassword123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))

    def test_reset_password_invalid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.post('/api/auth/reset-password/', {
            'uid': uid,
            'token': 'invalid_token',
            'new_password': 'newpassword123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_short_password(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        response = self.client.post('/api/auth/reset-password/', {
            'uid': uid,
            'token': token,
            'new_password': '123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
