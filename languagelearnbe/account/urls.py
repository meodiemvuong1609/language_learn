from django.urls import path
from account.views import auth_views, register_view, password_reset_views

urlpatterns = [
    path('auth/login/', auth_views.LoginView.as_view(), name='login'),
    path('auth/register/', register_view.RegisterView.as_view(), name='register'),
    path('auth/me/', auth_views.GetMeView.as_view(), name='me'),
    path('auth/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('auth/forgot-password/', password_reset_views.forgot_password_view, name='forgot-password'),
    path('auth/reset-password/', password_reset_views.reset_password_view, name='reset-password'),
]
