import User from "@models/user";
import { ConnectToDb } from "@utils/db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { EmployeeID, Password } = credentials;
      
        try {
          await ConnectToDb();
          const user = await User.findOne({ EmployeeID });
      
          if (!user) {
            console.log("User not found");
            throw new Error("User not found");
          }
      
          const passwordsMatch = await bcrypt.compare(Password, user.Password);
      
          if (!passwordsMatch) {
            console.log("Incorrect password");
            throw new Error("Incorrect password");
          }
      
          // Log user details for debugging
          // Return both user and status
          return user;
        } catch (error) {
          console.log("Error: ", error);
          throw new Error(error);
        }
      },
      
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          _id: user._id,
          EmployeeID: user.EmployeeID,
          Email: user.Email,
          defaultPaymentMode:user.defaultPaymentMode,
          defaultTravelPurpose:user.defaultTravelPurpose,
          addresses:user.addresses,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if(token){
        session.user = token.user;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

