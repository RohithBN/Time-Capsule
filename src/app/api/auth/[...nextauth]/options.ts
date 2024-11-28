import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import dbConnect from "@/app/helpers/dbConnect";
import userModel from "@/models/UserModel";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log(credentials.email, credentials.password);
        try {
          const user = await userModel.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          console.log("Signed in user:", user);
          return user; // Make sure you are returning the user correctly
        } catch (error: any) {
          console.error("Authentication error:", error.message);
          throw new Error(error.message || "Something went wrong during authentication.");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET_KEY, // Make sure this is set correctly in your environment variables
};
