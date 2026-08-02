import sqlite3, json, sys

db_path = r"C:\Users\ahmad\.local\share\mimocode\mimocode.db"
db = sqlite3.connect(db_path)
db.row_factory = sqlite3.Row

# 1. Find all sessions for this project (by directory match)
rows = db.execute("""
  SELECT id, project, title, time_created, directory
  FROM session
  WHERE directory LIKE '%IranianChessSchool%' OR project = 'IranianChessSchool'
  ORDER BY time_created DESC
  LIMIT 15
""").fetchall()

print("=== SESSIONS FOR IranianChessSchool ===")
for r in rows:
    print(f"{r['id']} | {r['project']} | {r['title'][:60]} | {r['time_created']} | {r['directory']}")

# 2. Count total sessions
total = db.execute("SELECT COUNT(*) as c FROM session WHERE directory LIKE '%IranianChessSchool%' OR project = 'IranianChessSchool'").fetchone()
print(f"\nTotal sessions: {total['c']}")

# 3. Check if current session exists
ses = db.execute("SELECT * FROM session WHERE id = 'ses_03e82cd58ffemwrUhmPxUDBl81'").fetchone()
print(f"\nCurrent session exists: {ses is not None}")
if ses:
    print(f"  Title: {ses['title']}, Created: {ses['time_created']}")

# 4. Get most recent 3 sessions with message counts
print("\n=== RECENT SESSIONS WITH MESSAGE COUNTS ===")
recent = db.execute("""
  SELECT s.id, s.title, s.time_created,
    (SELECT COUNT(*) FROM message m WHERE m.session_id = s.id) as msg_count
  FROM session s
  WHERE s.directory LIKE '%IranianChessSchool%' OR s.project = 'IranianChessSchool'
  ORDER BY s.time_created DESC
  LIMIT 5
""").fetchall()
for r in recent:
    print(f"{r['id'][:40]} | {r['msg_count']} msgs | {r['title'][:50]} | {r['time_created']}")

db.close()
