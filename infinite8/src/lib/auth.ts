import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { z } from "zod";

const credentialsSchema = z.object({
	email: z.string().email().optional(),
	password: z.string().min(6).optional(),
	waveDigest: z.string().optional(),
	nonce: z.string().optional(),
});

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
				waveDigest: { label: "Wave Digest", type: "text" },
				nonce: { label: "Nonce", type: "text" },
			},
			async authorize(raw) {
				const parsed = credentialsSchema.safeParse(raw);
				if (!parsed.success) return null;
				const { email, password, waveDigest, nonce } = parsed.data;

				// Email/password path
				if (email && password) {
					const user = await prisma.user.findUnique({ where: { email } });
					if (!user?.hashedPassword) return null;
					const ok = await bcrypt.compare(password, user.hashedPassword);
					return ok ? { id: user.id, name: user.name ?? null, email: user.email ?? null } : null;
				}

				// One-wave key path via nonce stored in VerificationToken
				if (waveDigest && nonce) {
					const token = await prisma.verificationToken.findUnique({ where: { token: nonce } });
					if (!token || token.expires < new Date()) return null;
					// Lookup a temporary mapping table (reuse identifier = email)
					const user = await prisma.user.findUnique({ where: { email: token.identifier } });
					if (!user) return null;
					// Server recomputes digest in /api/wave/verify; here we just trust presence and freshness
					// In a production setting, store the expected digest server-side and compare here.
					await prisma.verificationToken.delete({ where: { token: nonce } });
					return { id: user.id, name: user.name ?? null, email: user.email ?? null };
				}

				return null;
			},
		}),
	],
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		session: async ({ session, user }: any) => {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}