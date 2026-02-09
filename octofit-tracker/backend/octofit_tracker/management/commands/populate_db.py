from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete dependent objects first
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        for user in User.objects.all():
            if user.pk:
                user.delete()
        for team in Team.objects.all():
            if team.pk:
                team.delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        ironman = User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel)
        captain = User.objects.create(name='Captain America', email='cap@marvel.com', team=marvel)
        batman = User.objects.create(name='Batman', email='batman@dc.com', team=dc)
        superman = User.objects.create(name='Superman', email='superman@dc.com', team=dc)

        # Create activities
        Activity.objects.create(user=ironman, type='Running', duration=30)
        Activity.objects.create(user=batman, type='Cycling', duration=45)
        Activity.objects.create(user=superman, type='Swimming', duration=60)
        Activity.objects.create(user=captain, type='Walking', duration=20)

        # Create workouts
        Workout.objects.create(name='Hero HIIT', description='High intensity workout for heroes')
        Workout.objects.create(name='Power Yoga', description='Yoga for super strength')

        # Create leaderboard
        Leaderboard.objects.create(user=ironman, points=100)
        Leaderboard.objects.create(user=batman, points=90)
        Leaderboard.objects.create(user=superman, points=95)
        Leaderboard.objects.create(user=captain, points=80)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data'))
