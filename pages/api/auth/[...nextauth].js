import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import fs from 'fs';
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      let allowedEmails = JSON.parse(fs.readFileSync('private/allowedEmails.json'));
      if (account.provider === "google") {
        return profile.email_verified && allowedEmails.includes(profile.email);
      }
      return false // Do different verification for other providers that don't have `email_verified`
    },
  }
}
export default NextAuth(authOptions)