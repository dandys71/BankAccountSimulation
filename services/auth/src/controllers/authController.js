import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET }  from '../config/const.js';
import crypto from "crypto"; //pro generování refreshTokenu
import User from '../models/User.js';

//import { validate } from '../services/validationService.js';
//import * as ValidationSchemas from '../config/validationSchemas.js';



class AuthController {
  async loginUser(req, res, next) {
    try {  
      const { username, password } = req.body;
      const user = await User.findOne({ username: username }).select('-refreshToken -__v').lean();
      if (!user) return res.status(400).json({ message: "Uživatel neexistuje" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Špatné heslo" });

      // Vytvoření JWT tokenu
      const accessToken = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = crypto.randomBytes(64).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      // zápis refreshTokenu do DB
      const updatedUser = await User.findByIdAndUpdate(
              user._id, 
            { refreshToken: refreshToken });

      delete user.password;
      //delete user.refreshToken;

      // 1. Vytáhneme _id a zbytek uložíme do 'rest'
      const { _id, ...rest } = user;

      // 2. Sestavíme finální objekt s userId místo _id
      const userResponse = {
        userId: _id,
        ...rest
      };
/* //toto je pro JWT token předávaný pomocí httpOnly cookie
      res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000 // Platnost 15 minut (odpovídá expiresIn: '15m')
    });*/

      res.json({ message: "OK", accessToken, refreshToken, expiresAt, userResponse });

     
    } catch (e) {
      next(e);
    }
  }

  async introspect(req, res, next) {
    try {
        const { token } = req.body;
        const secretKey = JWT_SECRET;
        const decodedUser = jwt.verify(token, secretKey);
        const active = Date.now() <= (decodedUser.exp * 1000);

        const user = await User.findOne({ username: decodedUser.username }).select('-password -refreshToken -__v').lean();
        if (!user) return res.status(400).json({ message: "Uživatel neexistuje" });


        // 3. Vrácení dat o uživateli
        return res.json({message: "OK", active: active, userId: user._id, roles: user.roles, exp: decodedUser.exp});

      } catch (error) {
        // Pokud token vypršel nebo je zfalšovaný
        return res.status(401).json({ message: "Neplatné přihlášení nebo token" });
      }

    }

  async me(req, res, next) {
    try {/*
        // 1. Získání tokenu z HttpOnly cookie (díky cookie-parseru)
        const token = req.cookies.accessToken;*/
        const auth = req.headers['authorization'];
        if (!auth) {
          return res.status(401).json({ message: 'Missing or invalid Authorization header' });
        }

        const token = auth.split(' ')[1]; // Bearer <token>

        if (!token) {
          return res.status(401).json({ message: "Neplatné přihlášení nebo token" });
        }

        // 2. Ověření platnosti tokenu (použijte stejný tajný klíč jako při přihlášení)
        const secretKey = JWT_SECRET;
        const decodedUser = jwt.verify(token, secretKey);
        //console.log(decodedUser.username); 
        //console.log(token); 
        const user = await User.findOne({ username: decodedUser.username }).select('-password -refreshToken -__v').lean();
        if (!user) return res.status(400).json({ message: "Uživatel neexistuje" });

        // 1. Vytáhneme _id a zbytek uložíme do 'rest'
        const { _id, ...rest } = user;

        // 2. Sestavíme finální objekt s userId místo _id
        const userResponse = {
          userId: _id,
          ...rest
        };

        // 3. Vrácení dat o uživateli
        return res.json({message: "OK",userResponse});

      } catch (error) {
        // Pokud token vypršel nebo je zfalšovaný
        return res.status(403).json({ message: "Platnost tokenu vypršela nebo je neplatný." });
      }

    }

  async logout(req, res, next) {
    try {
        const { refreshToken } = req.body;
        console.log(refreshToken); 
        
        const result = await User.updateOne(
          { refreshToken: refreshToken },
          { $set: { refreshToken: "neaktivni" } }
        );
        console.log(result); 
        if (result.modifiedCount < 1) return res.status(400).json({ message: "Uživatel neexistuje" });
        else return res.json({message: "Odhlášeno"});

      } catch (error) {
        return res.status(401).json({ message: "Neplatný refreshToken." });
      }

    }


}

const controller = new AuthController();

export const loginUser = controller.loginUser.bind(controller);
export const me = controller.me.bind(controller);
export const introspect = controller.introspect.bind(controller);
export const logout = controller.logout.bind(controller);

