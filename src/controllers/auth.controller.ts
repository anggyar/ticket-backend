import { Request, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string; // email or username
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password not match"),
});

export default {
  async register(req: Request, res: Response) {
    // get data from body
    const { username, fullName, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    // Test validation
    try {
      await registerValidateSchema.validate({
        username,
        fullName,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        email,
        username,
        password,
      });

      // Kembalikan status 200 dan data user (kecuali password)
      res.status(200).json({
        message: "Success Registration",
        data: result,
      });
    } catch (error) {
      // Jika validasi gagal, kembalikan status 400 dan pesan error
      const err = error as unknown as Error;

      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response) {
    const { identifier, password } = req.body as unknown as TLogin;

    try {
      // ambil data user berdasarkan 'identifier' -> email dan username

      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      });

      // jika user tidak ditemukan
      if (!userByIdentifier) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      // jika password tidak sesuai
      if (!validatePassword) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      res.status(200).json({
        message: "Login Success",
        data: userByIdentifier,
      });
    } catch (error) {
      // Jika validasi gagal, kembalikan status 400 dan pesan error
      const err = error as unknown as Error;

      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
