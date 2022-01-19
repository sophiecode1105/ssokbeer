import db from "../../models/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verify } from "../token/verify";

db.sequelize.sync();

const users = db.users;
const contents = db.contents;

export const nickCheck = async (req, res) => {
  let { nickname } = req.body;
  let isNick = await users.findOne({ where: { nickname } });
  isNick = Boolean(isNick);

  return res.status(200).json({ nickname: isNick });
};

export const emailCheck = async (req, res) => {
  let { email } = req.body;
  let isEmail = await users.findOne({ where: { email } });
  isEmail = Boolean(isEmail);

  return res.status(200).json({ email: isEmail });
};

export const postSignup = async (req, res) => {
  const { nickname, email, password } = req.body;

  try {
    if (!nickname || !email || !password) {
      return res.status(400).json({ message: "닉네임,이메일 또는 비밀번호가 공백입니다" });
    }
    Hashpassword = await bcrypt.hash(password, 5);

    const [result, created] = await users.findOrCreate({
      where: { email },
      default: { nickname, email, Hashpassword },
    });

    if (!created) {
      return res.status(400).json({ message: "이미 가입된 회원입니다" });
    }
    const token = jwt.sign({ nickname, email }, process.env.ACCESS_SECRET, {
      expiresIn: "3h",
    });

    res.cookie("token", token);
    res.status(200).json({ token });
  } catch {
    res.status(400).json({ message: "회원가입실패" });
  }
};
export const signout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { email } = verify(token);
    await users.destroy({ where: { email } });
    res.status(200).json({ message: "회원탈퇴 성공" });
  } catch {
    res.status(400).json({ message: "회원탈퇴 실패" });
  }
};

export const getProfile = async (req, res) => {
  // let { id } = req.params;
  // id = parseInt(id);
  try {
    const { token } = req.cookies;

    const { email } = verify(token);

    const userInfo = await users.findOne({
      where: { email },
      include: { model: contents },
    });

    res.status(200).json(userInfo);
  } catch {
    res.status(400).json({ message: "내정보 불러오기 실패" });
  }
};

export const editProfile = async (req, res) => {
  // let { id } = req.params;
  try {
    const { token } = req.cookies;

    let { email } = verify(token);

    let { nickname, password } = req.body;
    password = await bcrypt.hash(password, 5);

    const userInfo = await users.update({ nickname, password }, { where: { email } });

    res.status(200).json({ message: "정보수정완료 ", userInfo });
  } catch {
    res.status(400).json({ message: "정보수정실패 " });
  }
};

export const getUserList = async (req, res) => {
  try {
    const usersInfo = await users.findAll({});
    res.status(200).json(usersInfo);
  } catch {
    res.status(400).json({ message: "유저리스트 불러오기 실패" });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "로그인 실패" });
    }

    const ok = await bcrypt.compare(password, user.dataValues.password);
    if (!ok) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(user.dataValues, process.env.ACCESS_SECRET, {
      expiresIn: "3h",
    });

    res.cookie("token", token);
    res.json({ userInfo: user.dataValues, token });
  } catch {
    return res.status(400).json({ message: "로그인 실패" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
