import bcrypt from "bcrypt";
import mongoose from 'mongoose';

//import { validate } from '../services/validationService.js';
//import * as ValidationSchemas from '../config/validationSchemas.js';


import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Institution from '../models/Institution.js';



class UsersController {
  async createUser(req, res, next) {
    try {
      const { username, password, displayName, email, organizationIds, institutionIds, roles } = req.body;

       // Kontrola organizace dodělat
       // Kontrola instituce dodělat

      const hashed = await bcrypt.hash(password, 10);
      // Vytvoření nového uživatele v DB
      const newUser = new User({ username, password: hashed, displayName, email, organizationIds, institutionIds, roles });
      await newUser.save();

      const userObj = newUser.toObject();

      // 1. Vytáhneme _id a zbytek uložíme do 'rest'
      const { _id, ...rest } = userObj;

      // 2. Sestavíme finální objekt s userId místo _id
      const userResponse = {
        userId: _id,
        ...rest
      };

      res.status(201).json({ message: 'Vytvořeno', user: userResponse });

    } catch (e) {
      next(e);
    }
  }

  async listUsers(req, res, next) {
    try {
      let users = await User.find().select('-password -refreshToken -__v').lean();
      // 2. Přepsání původní proměnné novým polem
      users = users.map(user => {
        const { _id, ...rest } = user;
        return {
          userId: _id,
          ...rest
        };
      });
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async deactivateUser(req, res, next) {
    try {
      const { userId } = req.body;

      // 1. Kontrola formátu ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Neplatný formát ID uživatele" });
      }
        
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
      { isActive: false });
      if (!updatedUser) {
		    return res.status(404).json({ message: 'Uživatel s tímto ID neexistuje.'});
	    }
        res.status(200).json({ message: "OK" });
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { userId, password: newPassword, displayName: newDisplayName, email: newEmail, isActive: newIsActive } = req.body;
  
      // 1. Kontrola formátu ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Neplatný formát ID uživatele" });
      }
  
      // 2. Dynamicky sestavíme pouze data, která chceme změnit
      const updateData = {};
      if (newDisplayName !== undefined) updateData.displayName = newDisplayName;
      if (newEmail !== undefined) updateData.email = newEmail;
      if (newIsActive !== undefined) updateData.isActive = newIsActive;
  
      // 3. Heslo zahashujeme a přidáme jen tehdy, pokud ho uživatel reálně poslal
      if (newPassword) {
        updateData.password = await bcrypt.hash(newPassword, 10);
      }
  
      // 4. Provedeme update pouze s fields, které se mění
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { $set: updateData }, // $set zajistí, že přepíšeme jen klíče v updateData
        { new: true, runValidators: true } // runValidators spustí kontroly (např. unikátní e-mail)
      ).select('-password -__v').lean();
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Uživatel s tímto ID neexistuje.'});
      }

      // 1. Vytáhneme _id a zbytek uložíme do 'rest'
      const { _id, ...rest } = updatedUser;

      // 2. Sestavíme finální objekt s userId místo _id
      const userResponse = {
        userId: _id,
        ...rest
      };
  
      res.status(200).json({ message: "OK" , user: userResponse });
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.body;

      // 1. Kontrola formátu ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Neplatný formát ID uživatele" });
      }
        
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
		    return res.status(404).json({ message: 'Uživatel s tímto ID neexistuje.'});
	    }
        res.status(201).json({ message: `Uživatel ${deletedUser.username} byl úspěšně smazán.` });
    } catch (e) {
      next(e);
    }
  }
  
  async getUserById(req, res, next) {
    try {
      const id = req.query.userId; // Získá hodnotu z get getUserById?userId=12345"
      // 1. Kontrola formátu ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Neplatný formát ID uživatele" });
      }
      const user = await User.findById(id).select('-password -refreshToken -__v').lean(); 
        // findById(id) interně hledá podle pole _id

        if (!user) {
            return res.status(404).json({ message: "Nenalezeno" });
        }

        const { _id, ...rest } = user;
        const userResponse = {
          userId: _id,
          ...rest
        };

        res.json({ message: 'OK', userResponse});
    } catch (e) {
      next(e);
    }
  }

  async assignRole(req, res, next) {
    try {
      const { userId, role } = req.body;

      // 1. Kontrola formátu ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Neplatný formát ID uživatele" });
      }
        
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
      { // 2. Bezpečné přidání do pole bez vzniku duplicit
        $addToSet: { roles: role }});
      if (!updatedUser) {
		    return res.status(404).json({ message: 'Uživatel s tímto ID neexistuje.'});
	    }
        res.status(200).json({ message: "OK" });
    } catch (e) {
      next(e);
    }
  }

async revokeRole(req, res, next) {
  try {
    const { userId, role } = req.body;

    // 1. Kontrola formátu ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Neplatný formát ID uživatele" });
    }
      
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
    { // 2. Bezpečné přidání do pole bez vzniku duplicit
      $pull: { roles: role }});
    if (!updatedUser) {
      return res.status(404).json({ message: 'Uživatel s tímto ID neexistuje.'});
    }
      res.status(200).json({ message: "OK" });
  } catch (e) {
    next(e);
  }
}
}

const controller = new UsersController();

export const getUserById = controller.getUserById.bind(controller);
export const listUsers = controller.listUsers.bind(controller);
export const createUser = controller.createUser.bind(controller);
export const updateUser = controller.updateUser.bind(controller);
export const deactivateUser = controller.deactivateUser.bind(controller);
export const deleteUser = controller.deleteUser.bind(controller);
export const assignRole = controller.assignRole.bind(controller);
export const revokeRole = controller.revokeRole.bind(controller);