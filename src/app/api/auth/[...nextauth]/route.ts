import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const db = await connectToDatabase();

        // MOCK MODE FALLBACK: If MongoDB fails to connect, allow login with any credentials
        if (!db) {
          console.warn("Using mock authentication because MongoDB is unavailable.");
          return {
            id: "mock_user_123",
            email: credentials.email,
            name: credentials.email.split("@")[0],
          };
        }

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("This account uses Google sign-in. Please log in with Google.");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.displayName || user.email.split("@")[0],
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        
        try {
          // Check if user exists
          let dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            // Create a new user for Google login
            dbUser = await User.create({
              email: user.email,
              googleId: account.providerAccountId,
              displayName: user.name || profile?.name,
              photoURL: user.image || (profile as any)?.picture,
              youtubeAccessToken: account.access_token,
              youtubeRefreshToken: account.refresh_token,
              youtubeTokenExpiresAt: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
            });
          } else {
            // Update existing user with latest tokens
            dbUser.googleId = account.providerAccountId;
            dbUser.youtubeAccessToken = account.access_token;
            if (account.refresh_token) {
              dbUser.youtubeRefreshToken = account.refresh_token;
            }
            if (account.expires_at) {
              dbUser.youtubeTokenExpiresAt = new Date(account.expires_at * 1000);
            }
            if (!dbUser.photoURL && user.image) {
              dbUser.photoURL = user.image;
            }
            await dbUser.save();
          }
          
          user.id = dbUser._id.toString();
          return true;
        } catch (error) {
          console.error("Error during Google signIn:", error);
          return false;
        }
      }
      return true; // For credentials provider
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session as any).accessToken = token.accessToken;
        
        // Fetch latest user data from DB to ensure we have their photoURL
        try {
          await connectToDatabase();
          const dbUser = await User.findById(token.id);
          if (dbUser) {
            session.user.name = dbUser.displayName || dbUser.email.split("@")[0];
            session.user.image = dbUser.photoURL || null;
          }
        } catch (error) {
          console.error("Error fetching user for session:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
