import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError";

class AuthService {
  async login(employeeCode: string, password: string) {
    const member = await prisma.teamMember.findUnique({
      where: { employeeCode },
      select: {
        id: true,
        name: true,
        employeeCode: true,
        passwordHash: true,
        status: true,
        role: { select: { id: true, name: true } },
        firstLogin: true,
      },
    });

    if (!member || !member.passwordHash) {
      throw new CustomError("Invalid credentials", 401);
    }

    if (member.status === "Inactive") {
      throw new CustomError("Account is inactive", 403);
    }

    const passwordMatch = await bcrypt.compare(password, member.passwordHash);
    if (!passwordMatch) {
      throw new CustomError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      {
        id: member.id,
        name: member.name,
        employeeCode: member.employeeCode,
        role: member.role.name,
        firstLogin: member.firstLogin,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }, // shift-length session
    );

    return {
      token,
      user: {
        id: member.id,
        name: member.name,
        employeeCode: member.employeeCode,
        role: member.role,
        firstLogin: member.firstLogin,
      },
    };
  }
  async changePassword(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.teamMember.update({
      where: { id },
      data: {
        passwordHash,
        firstLogin: false, // flip the flag
      },
    });
  }
}

export default new AuthService();
