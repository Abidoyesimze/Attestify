from django.core.management.base import BaseCommand
from defi.models import Strategy

class Command(BaseCommand):
    help = 'Seed initial investment strategies'

    def handle(self, *args, **options):
        strategies = [
            {
                'name': Strategy.CONSERVATIVE,
                'description': 'Low-risk strategy focusing on stablecoin lending',
                'expected_apy_min': 3.0,
                'expected_apy_max': 5.0,
                'risk_level': 1
            },
            {
                'name': Strategy.BALANCED,
                'description': 'Balanced mix of stablecoin and DeFi protocols',
                'expected_apy_min': 5.0,
                'expected_apy_max': 10.0,
                'risk_level': 2
            },
            {
                'name': Strategy.GROWTH,
                'description': 'Higher-yield opportunities with managed risk',
                'expected_apy_min': 10.0,
                'expected_apy_max': 15.0,
                'risk_level': 3
            }
        ]
        
        for strategy_data in strategies:
            Strategy.objects.get_or_create(
                name=strategy_data['name'],
                defaults=strategy_data
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded strategies'))