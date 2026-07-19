from contextlib import asynccontextmanager

from bson import ObjectId
from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware

from .database import client, users_collection
from .schemas import UserCreate, UserResponse, UserUpdate


def serialize_user(user: dict) -> dict:
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"], "phone": user["phone"], "city": user["city"]}


async def get_user_or_404(user_id: str) -> dict:
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    client.close()


app = FastAPI(title="User Details CRUD API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.get("/api/users", response_model=list[UserResponse])
async def list_users():
    users = await users_collection.find().sort("name", 1).to_list(length=None)
    return [serialize_user(user) for user in users]


@app.post("/api/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate):
    if await users_collection.find_one({"email": payload.email}):
        raise HTTPException(status_code=409, detail="A user with this email already exists")
    result = await users_collection.insert_one(payload.model_dump())
    user = await users_collection.find_one({"_id": result.inserted_id})
    return serialize_user(user)


@app.put("/api/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, payload: UserUpdate):
    await get_user_or_404(user_id)
    duplicate = await users_collection.find_one({"email": payload.email, "_id": {"$ne": ObjectId(user_id)}})
    if duplicate:
        raise HTTPException(status_code=409, detail="A user with this email already exists")
    await users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": payload.model_dump()})
    return serialize_user(await users_collection.find_one({"_id": ObjectId(user_id)}))


@app.delete("/api/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str):
    await get_user_or_404(user_id)
    await users_collection.delete_one({"_id": ObjectId(user_id)})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
