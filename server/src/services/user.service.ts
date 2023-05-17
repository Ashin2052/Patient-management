import bcrypt from "bcrypt";
import UserSchema from "../models/user.schema";
import jwt from "jsonwebtoken";
import logger from "../configs/logger";

export const register = async (req) => {
  const { email, password, confirmPassword } = req.body;
  const user = await UserSchema.findOne({
    email: req.body.email,
  });
  if (user?.email === email) {
    throw new Error("User already exists");
  }
  if (password !== confirmPassword) {
    throw new Error("Password and Confirm Password do not match");
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    return await UserSchema.create({
      ...req.body,
      password: hashPassword,
    });
  } catch (error) {
    logger.error(`${email} register error : ${error.toString()}`);
  }
};

export const login = async (req) => {
  try {
    const user = await UserSchema.findOne({
      email: req.body.email,
    });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw { message: "Password does not match" };
    }
    const { id, name, email } = user;
    const accessToken = jwt.sign(
      { id, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );
    const refreshToken = jwt.sign(
      { id, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await UserSchema.findByIdAndUpdate(id, { refreshToken: refreshToken });
    return { accessToken, refreshToken, userInfo: user };
  } catch (error) {
    throw { message: error.message ? error.message : "Email not found" };
  }
};

export const generateRefreshToken = async (req, res) => {
  try {
    //get refreshToken
    const oldRefreshToken = req.body.refreshToken;
    //send error if no refreshToken is sent
    if (!oldRefreshToken) {
      return res.status(403).json({ error: "Access denied,token missing!" });
    } else {
      //query for the token to check if it is valid:
      const user = await UserSchema.findOne({
        refreshToken: oldRefreshToken,
      }).lean();
      const { id, name, email, refreshToken } = user;

      //send error if no token found:
      if (!user) {
        return res.status(401).json({ error: "Token expired!" });
      } else {
        //extract payload from refresh token and generate a new access token and send it
        const payload = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        return {
          accessToken: jwt.sign(
            { id, name, email },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "60s",
            }
          ),
        };
      }
    }
  } catch (error) {
    throw { error: "Internal Server Error!" };
  }
};

//todo
export const logout = async (req, res) => {
  try {
    // const refreshToken = req.cookies.refreshToken;
    // if (!refreshToken) return res.sendStatus(204);
    // const user = await UserSchema.findOne({
    //     refreshToken: refreshToken
    // });
    // if (!user[0]) return res.sendStatus(204);
    // const userId = user[0].id;
    // await UserSchema.findByIdAndUpdate(userId, {refreshToken: null}
    // );
    // res.clearCookie('refreshToken');
    // return res.sendStatus(200);
    return;
  } catch (err) {
    logger.error(err.toString());
  }
};
