import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "autodevgenie"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(DB_NAME)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const employees = await db.collection("employees").find({}).toArray()

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const employee = {
      ...body,
      experience: Number.parseInt(body.experience),
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("employees").insertOne(employee)

    return NextResponse.json({
      message: "Employee registered successfully",
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Error registering employee:", error)
    return NextResponse.json({ error: "Failed to register employee" }, { status: 500 })
  }
}
