import { Request, Response } from "express";
import * as Yup from "yup";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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

      // Kembalikan status 200 dan data user (kecuali password)
      res.status(200).json({
        message: "Success Registration",
        data: {
          fullName,
          username,
          email,
        },
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
