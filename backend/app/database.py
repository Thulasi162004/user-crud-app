from motor.motor_asyncio import AsyncIOMotorClient

from .config import MONGODB_DATABASE, MONGODB_URL

client = AsyncIOMotorClient(MONGODB_URL)
database = client[MONGODB_DATABASE]
users_collection = database.get_collection("users")
