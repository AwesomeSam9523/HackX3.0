import {PrismaClient} from "@prisma/client";
import {comparePassword, generateRandomPassword, hashPassword} from "../utils/password";
import {generateToken} from "../utils/jwt";
import type {ChangePasswordRequest, JWTPayload, LoginRequest} from "../types";

const prisma = new PrismaClient();

export class AuthService {
  async login(credentials: LoginRequest) {
    const { username, password } = credentials;
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        participantTeam: true,
        mentorProfile: true,
        judgeProfile: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.status === "DISABLED") {
      throw new Error("Account is disabled");
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      console.log('wrong compare')
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async changePassword(userId: string, request: ChangePasswordRequest) {
    const { currentPassword, newPassword } = request;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  async resetPassword(user: JWTPayload | undefined, userId: string) {
    // Generate new random password
    const newPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(newPassword);

    // check if new user role is lower than current user role
    if (!user) {
      throw new Error("Unauthorized");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
      },
    });

    if (!targetUser) {
      throw new Error("User not found");
    }

    if (user.role === 'ADMIN' && ['ADMIN', 'SUPER_ADMIN'].includes(targetUser.role)) {
      throw new Error("Cannot reset password for users with higher or equal role");
    }

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return newPassword;
  }

  async createUser(userData: {
    username: string
    password: string
    email?: string
    role: string
  }) {
    const { username, password, email, role } = userData;

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: role as any,
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        participantTeam: true,
        mentorProfile: true,
        judgeProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
