import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MongoDB connection string is required");
}
const client = new MongoClient(uri);
const dbName = "vito-ex";
const collectionName = "users";

async function connectToDB() {
    if (!client.connect()) {
        await client.connect();
    }
    return client.db(dbName).collection(collectionName);
}

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return NextResponse.json({ error: "Invalid content type. Expected JSON." }, { status: 400 });
        }

        let body;
        try {
            body = await request.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }

        const { type, firstname, lastname, email, password } = body;

        if (!type || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const usersCollection = await connectToDB();

        if (type === "signup") {
            if (!firstname || !lastname) {
                return NextResponse.json({ error: "First name and last name are required for signup" }, { status: 400 });
            }

            // Check if user already exists
            const userExists = await usersCollection.findOne({ email });
            if (userExists) {
                return NextResponse.json({ error: "User already exists" }, { status: 400 });
            }

            // Create new user
            await usersCollection.insertOne({ firstname, lastname, email, password });
            return NextResponse.json({ message: "User signed up successfully" }, { status: 201 });
        }

        if (type === "signin") {
            // Authenticate user
            const user = await usersCollection.findOne({ email, password });
            if (!user) {
                return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
            }

            return NextResponse.json({ message: "User signed in successfully" }, { status: 200 });
        }

        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const usersCollection = await connectToDB();
        const users = await usersCollection.find({}).toArray();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
    }
}

