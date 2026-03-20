from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    # Daily scrapes (6-10am UTC)
    "scrape-eeas": {
        "task": "scrape",
        "args": ["eeas"],
        "schedule": crontab(hour=6, minute=0),
    },
    "scrape-eda": {
        "task": "scrape",
        "args": ["eda"],
        "schedule": crontab(hour=6, minute=15),
    },
    "scrape-nato": {
        "task": "scrape",
        "args": ["nato_is"],
        "schedule": crontab(hour=7, minute=0),
    },
    "scrape-nspa": {
        "task": "scrape",
        "args": ["nspa"],
        "schedule": crontab(hour=7, minute=15),
    },
    "scrape-eurobrussels": {
        "task": "scrape",
        "args": ["eurobrussels"],
        "schedule": crontab(hour=8, minute=0),
    },
    "scrape-frontex": {
        "task": "scrape",
        "args": ["frontex"],
        "schedule": crontab(hour=9, minute=0),
    },
    # Twice-weekly scrapes
    "scrape-euiss": {
        "task": "scrape",
        "args": ["euiss"],
        "schedule": crontab(hour=9, minute=0, day_of_week="1,4"),
    },
    "scrape-epso": {
        "task": "scrape",
        "args": ["eu_careers"],
        "schedule": crontab(hour=8, minute=0, day_of_week="1"),
    },
    # Maintenance
    "deactivate-expired": {
        "task": "deactivate_expired",
        "schedule": crontab(hour=5, minute=0),
    },
    "recompute-matches": {
        "task": "recompute_all_matches",
        "schedule": crontab(hour=11, minute=0),
    },
    # Alerts
    "send-daily-alerts": {
        "task": "send_alerts",
        "args": ["daily"],
        "schedule": crontab(hour=8, minute=30),
    },
    "send-weekly-alerts": {
        "task": "send_alerts",
        "args": ["weekly"],
        "schedule": crontab(hour=8, minute=30, day_of_week="1"),
    },
}
