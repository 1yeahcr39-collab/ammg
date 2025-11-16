#!/usr/bin/env python3
"""
create_admin.py

Safe helper to create or promote an admin user in the MinuteMinds MongoDB.
Usage:
  python3 scripts/create_admin.py --email admin@example.com --name Admin --password Password123

If the user exists the script will set role="admin" and optionally reset the password (use --reset-password).
"""
import argparse
from pymongo import MongoClient
import bcrypt
from datetime import datetime
import os

parser = argparse.ArgumentParser()
parser.add_argument('--mongo', default=os.getenv('MONGO_URL','mongodb://localhost:27017'), help='MongoDB URI')
parser.add_argument('--email', required=True)
parser.add_argument('--name', required=True)
parser.add_argument('--password', required=True)
parser.add_argument('--reset-password', action='store_true', help='Reset the password even if user exists')
args = parser.parse_args()

client = MongoClient(args.mongo)
db = client['meeting_minutes']
users = db['users']

email = args.email.lower()
user = users.find_one({'email': email})

hashed = bcrypt.hashpw(args.password.encode('utf-8'), bcrypt.gensalt())
now = datetime.utcnow()

if user:
    update = {'$set': {'role': 'admin', 'updated_at': now}}
    if args.reset_password:
        update['$set']['password'] = hashed
    res = users.update_one({'_id': user['_id']}, update)
    print(f'Existing user found. modified_count={res.modified_count}')
    print(users.find_one({'email': email}))
else:
    doc = {
        'name': args.name,
        'email': email,
        'password': hashed,
        'role': 'admin',
        'created_at': now,
        'updated_at': now
    }
    res = users.insert_one(doc)
    print(f'Inserted new admin user with id: {res.inserted_id}')
    print(users.find_one({'_id': res.inserted_id}))

print('\nDone. You can now log in via /login and access /admin/* endpoints with the returned token.')
