SCRAPERS = {
    "eeas": {
        "name": "EEAS Vacancies",
        "base_url": "https://www.eeas.europa.eu/eeas/vacancies_en",
        "method": "playwright",
        "schedule": "0 6 * * *",
    },
    "eda": {
        "name": "European Defence Agency",
        "base_url": "https://vacancies.eda.europa.eu/",
        "method": "html",
        "schedule": "0 6 * * *",
    },
    "nato_is": {
        "name": "NATO International Staff",
        "base_url": "https://nato.taleo.net/careersection/2/jobsearch.ftl",
        "method": "playwright",
        "schedule": "0 7 * * *",
    },
    "nspa": {
        "name": "NATO NSPA",
        "base_url": "https://nspa-nato.career.emply.com/vacancies",
        "method": "html",
        "schedule": "0 7 * * *",
    },
    "eu_careers": {
        "name": "EU Careers (EPSO)",
        "base_url": "https://eu-careers.europa.eu/en/job-opportunities",
        "method": "html",
        "schedule": "0 8 * * 1",
    },
    "eurobrussels": {
        "name": "EuroBrussels",
        "base_url": "https://www.eurobrussels.com/job_search",
        "method": "html",
        "schedule": "0 8 * * *",
    },
    "euiss": {
        "name": "EU Institute for Security Studies",
        "base_url": "https://www.iss.europa.eu/about-us/opportunities",
        "method": "html",
        "schedule": "0 9 * * 1,4",
    },
    "frontex": {
        "name": "Frontex",
        "base_url": "https://www.frontex.europa.eu/careers/vacancies/",
        "method": "html",
        "schedule": "0 9 * * *",
    },
    "euspa": {
        "name": "EU Agency for Space Programme",
        "base_url": "https://www.euspa.europa.eu/about/careers",
        "method": "html",
        "schedule": "0 9 * * 1,4",
    },
}


def get_scraper_config(source_id: str) -> dict | None:
    return SCRAPERS.get(source_id)


def list_sources() -> list[str]:
    return list(SCRAPERS.keys())
