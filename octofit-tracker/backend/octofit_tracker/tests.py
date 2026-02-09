from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class UserModelTest(TestCase):
    def test_create_user(self):
        team = Team.objects.create(name='Test Team')
        user = User.objects.create(email='test@example.com', name='Test User', team=team)
        self.assertEqual(user.email, 'test@example.com')
        user_team = user.team
        self.assertIsNotNone(user_team)
        self.assertEqual(user_team.name, 'Test Team')

class TeamModelTest(TestCase):
    def test_create_team(self):
        team = Team.objects.create(name='Marvel', description='Marvel Team')
        self.assertEqual(team.name, 'Marvel')

class ActivityModelTest(TestCase):
    def test_create_activity(self):
        team = Team.objects.create(name='DC')
        user = User.objects.create(email='batman@dc.com', name='Batman', team=team)
        activity = Activity.objects.create(user=user, type='Running', duration=30, date='2024-01-01')
        self.assertEqual(activity.type, 'Running')

class WorkoutModelTest(TestCase):
    def test_create_workout(self):
        workout = Workout.objects.create(name='Pushups', description='Upper body')
        self.assertEqual(workout.name, 'Pushups')

class LeaderboardModelTest(TestCase):
    def test_create_leaderboard(self):
        team = Team.objects.create(name='Justice League')
        user = User.objects.create(email='superman@dc.com', name='Superman', team=team)
        leaderboard = Leaderboard.objects.create(user=user, points=100)
        self.assertEqual(leaderboard.points, 100)
