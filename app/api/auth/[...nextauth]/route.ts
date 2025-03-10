import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MongoDB connection string is required");
}

const client = new MongoClient(uri);
const dbName = "vito-x";
const collectionName = "users";

async function connectToDB() {
    if (!client.connect()) {
        await client.connect();
    }
    return client.db(dbName).collection(collectionName);
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }
                try {
                    const usersCollection = await connectToDB();
                    const user = await usersCollection.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error('Invalid password');
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: `${user.firstname} ${user.lastname}`
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    throw new Error('Authentication failed');
                } finally {
                    // Close the connection after auth
                    await client.close();
                }
            }
        })
    ],
    pages: {
        signIn: '/auth',
        signOut: '/', // Redirect to home page after signout
        error: '/auth', // Error page
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                
                session.user.id = token.id;
                session.user.name = token.name;
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };