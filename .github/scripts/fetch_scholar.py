from scholarly import scholarly
import json, datetime, os, sys

try:
    author = scholarly.search_author_id('b6_ntD4AAAAJ')
    author = scholarly.fill(author, sections=['basics', 'indices'])
    data = {
        'citations': author.get('citedby', 0),
        'hindex':    author.get('hindex', 0),
        'updated':   datetime.date.today().isoformat()
    }
    print(f"Fetched: {data}")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    try:
        with open('data/stats.json') as f:
            data = json.load(f)
        print(f"Keeping existing data: {data}")
    except Exception:
        print("No existing data to fall back on.", file=sys.stderr)
        sys.exit(1)

os.makedirs('data', exist_ok=True)
with open('data/stats.json', 'w') as f:
    json.dump(data, f, indent=2)
