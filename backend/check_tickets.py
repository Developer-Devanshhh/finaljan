from pymongo import MongoClient
import json
from bson.json_util import dumps

client = MongoClient('mongodb://localhost:27017/civicai')
db = client['civicai']
tickets = db['tickets']
print(dumps(tickets.find().sort('_id', -1).limit(1), indent=2))
