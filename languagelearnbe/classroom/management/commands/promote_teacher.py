from django.core.management.base import BaseCommand, CommandError
from account.models import Account


class Command(BaseCommand):
    help = 'Create or promote a teacher account (Cô Ngọc Thảo / staff).'

    def add_arguments(self, parser):
        parser.add_argument('username')
        parser.add_argument('--email', default='')
        parser.add_argument('--password', default='')
        parser.add_argument('--full-name', default='Ngọc Thảo')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email'] or f'{username}@local'
        full_name = options['full_name']
        password = options['password']

        user, created = Account.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'full_name': full_name,
                'role': Account.ROLE_TEACHER,
                'status': Account.STATUS_ACTIVE,
                'is_staff': True,
            },
        )
        user.role = Account.ROLE_TEACHER
        user.status = Account.STATUS_ACTIVE
        user.is_staff = True
        if email:
            user.email = email
        if full_name:
            user.full_name = full_name
        if password:
            user.set_password(password)
        elif created:
            raise CommandError('Password is required when creating a new teacher.')
        user.save()
        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} teacher {user.username}'))
