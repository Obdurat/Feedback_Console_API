import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import CustomError from "../utils/customError";
import sseManager from "../utils/sse";

class AuthService {
  async initLogin(employeeCode: string) {
    const member = await prisma.teamMember.findUnique({
      where: { employeeCode },
      select: {
        id: true,
        name: true,
        employeeCode: true,
        status: true,
        totpEnabled: true,
        totpSecret: true,
        role: { select: { id: true, name: true } },
      },
    });

    if (!member) throw new CustomError("Invalid employee code", 401);
    if (member.status === "Inactive")
      throw new CustomError("Account is inactive", 403);

    // First login — generate secret and return QR code
    if (!member.totpEnabled) {
      const secret = speakeasy.generateSecret({
        name: `Bolt TMS (${member.employeeCode})`,
      });

      await prisma.teamMember.update({
        where: { id: member.id },
        data: { totpSecret: secret.base32 },
      });

      const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url!);

      return {
        firstLogin: true,
        qrCode: qrCodeDataUrl,
        memberId: member.id,
      };
    }

    // Regular login — just signal that TOTP code is needed
    return {
      firstLogin: false,
      memberId: member.id,
    };
  }

  async verifyTotp(memberId: string, code: string) {
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        employeeCode: true,
        totpSecret: true,
        totpEnabled: true,
        role: { select: { id: true, name: true } },
      },
    });

    if (!member?.totpSecret) throw new CustomError("TOTP not set up", 400);

    const isValid = speakeasy.totp.verify({
      secret: member.totpSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) throw new CustomError("Invalid or expired code", 401);

    // If this was first login, enable TOTP now
    if (!member.totpEnabled) {
      await prisma.teamMember.update({
        where: { id: member.id },
        data: { totpEnabled: true },
      });
    }

    const token = jwt.sign(
      {
        id: member.id,
        name: member.name,
        employeeCode: member.employeeCode,
        role: member.role.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" },
    );

    sseManager.broadcast("session:kicked", { memberId: member.id });

    return {
      token,
      user: {
        id: member.id,
        name: member.name,
        employeeCode: member.employeeCode,
        role: member.role,
      },
    };
  }
}

export default new AuthService();
