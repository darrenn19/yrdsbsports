# Tier 1 Junior Boys Basketball Schedule
import requests
from bs4 import BeautifulSoup
import json
import re

def clean_text(text: str) -> str:
    """Remove whitespace and return clean string"""
    return re.sub(r"\s+", " ", text).strip()

def scrape_schedule():
    url = "http://yraa.com/src/schedule.php?division=77"  # Schedule over next 7 days
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(url, headers=headers, timeout=10)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    schedule = []
    current_date = None
    seen_games = set()

    for row in soup.find_all("tr"):
        cells = [clean_text(c.get_text()) for c in row.find_all("td")]
        if not cells:
            continue

        # Detect date row
        if len(cells) == 1 and any(month in cells[0] for month in [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ]):
            # If we hit a new date, add a placeholder for “no games”
            current_date = cells[0]
            schedule.append({
                "date": current_date,
                "home_team": None,
                "away_team": None,
                "time": None,
                "location": None,
                "game_played": False,
                "final_score": None
            })
            continue

        # Skip headers
        if cells[0].upper() in ["TEAMS", "TIME", "LOCATION"]:
            continue

        if len(cells) >= 3 and current_date:
            raw_teams = clean_text(cells[0])
            time = clean_text(cells[1])
            location = clean_text(cells[2])

            if not raw_teams or "No games" in raw_teams:
                continue

            game_played = any(ch.isdigit() for ch in raw_teams)

            home_team, away_team, final_score = None, None, None

            # Case 1: at HomeTeam Score, AwayTeam Score
            match1 = re.match(r"at\s+(.+?)\s+(\d+),\s*(.+?)\s+(\d+)", raw_teams)
            # Case 2: AwayTeam Score, at HomeTeam Score
            match2 = re.match(r"(.+?)\s+(\d+),\s*at\s+(.+?)\s+(\d+)", raw_teams)
            # Case 3: at HomeTeam, AwayTeam (no scores)
            match3 = re.match(r"at\s+(.+?),\s*(.+)", raw_teams)
            # Case 4: AwayTeam, at HomeTeam (no scores)
            match4 = re.match(r"(.+?),\s*at\s+(.+)", raw_teams)

            if match1:
                home_team = match1.group(1)
                away_team = match1.group(3)
                final_score = f"{home_team} {match1.group(2)}, {away_team} {match1.group(4)}"
            elif match2:
                away_team = match2.group(1)
                home_team = match2.group(3)
                final_score = f"{home_team} {match2.group(4)}, {away_team} {match2.group(2)}"
            elif match3:
                home_team = match3.group(1)
                away_team = match3.group(2)
                game_played = False
            elif match4:
                away_team = match4.group(1)
                home_team = match4.group(2)
                game_played = False

            if not home_team or not away_team:
                continue

            game_key = (current_date, home_team, away_team, time, location)
            if game_key in seen_games:
                continue
            seen_games.add(game_key)

            # Replace placeholder “no games” row for this date with actual game(s)
            if (schedule and schedule[-1]["date"] == current_date 
                and schedule[-1]["home_team"] is None):
                schedule.pop()

            schedule.append({
                "date": current_date,
                "home_team": clean_text(home_team),
                "away_team": clean_text(away_team),
                "time": time,
                "location": location,
                "game_played": game_played,
                "final_score": final_score
            })

    # Save JSON
    with open("basketball/jb/schedule.json", "w", encoding="utf-8") as f:
        json.dump({"schedule": schedule}, f, indent=4, ensure_ascii=False)

    print(f"Saved {len(schedule)} entries to basketball/jb/schedule.json")

if __name__ == "__main__":
    scrape_schedule()
