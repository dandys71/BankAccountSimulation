import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {JWT_SECRET} from '../config/const.js';


const users = []; // jen pro demo



class UsersController {
  async createUser(req, res, next) {
    try {
      const { username, password } = req.body;

      const hashed = await bcrypt.hash(password, 10);
      users.push({ username, password: hashed });

      res.json({ message: "Uživatel zaregistrován" });
    } catch (e) {
      next(e);
    }
  }

  async loginUser(req, res, next) {
      const { username, password } = req.body;

      const user = users.find(u => u.username === username);
      if (!user) return res.status(400).json({ error: "Uživatel neexistuje" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Špatné heslo" });

      // Vytvoření JWT tokenu
      const token = jwt.sign(
        { username: user.username },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ token });
    }


}

const controller = new UsersController();

export const createUser = controller.createUser.bind(controller);
export const loginUser = controller.loginUser.bind(controller);

