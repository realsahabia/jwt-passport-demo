import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
 import { Router } from "express";
 import dotenv from "dotenv";
 import crypto from "crypto";

 const userRouter = Router();
 dotenv.config();

 export const users = [];

 userRouter.post("/register", async (req, res) =>{
    try{
        const {username, password} = req.body;

        const hashedpasseword = await bcrypt.hash(password, 10);
        const newUser = {username, password: hashedpasseword};
        users.push(newUser);

        res
        .status(201)
        .json({
                message: "user registered successfully",
                user: newUser
        })
    }catch(err){
        console.log(err.message)
    }
 });

 userRouter.post("/login", async (req, res) =>{
    try {
        const {username, password} = req.body;

        const findUser = users.find((user) => user.username === username);

        if (!findUser) {
            return res.status(400).json({ message: "Invalid username or password"});
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);

        if (!passwordMatch){
            res.status(400).json({
                message: "Wrong password"
            })
        }

        const refreshToken = crypto.randomBytes(64).toString('hex');
        findUser.refreshToken = refreshToken;

        const accessToken = jwt.sign(
            { username: findUser.username},
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successfully",
            accessToken,
            refreshToken
        })

    }catch(err){
        console.log(err.message)
    }
 });

 userRouter.post("/token", (req, res) =>{
    const {refreshToken} = req.body;

    const findUser = users.find(u => u.refreshToken === refreshToken);

    if (!findUser) {
        return res.status(403).json({
            message: "Invalid refresh token"
        });
    }

    const newToken = jwt.sign(
        {username: findUser.username},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );

    res.json({
        message: "New acces token generated",
        accessToken: newToken
    })
 });

 userRouter.post("/logout", (req, res) => {
    const { refreshToken } = req.body; // Typically, access tokens shouldn't need to be sent to logout.

    // Find the user by refresh token
    const findUser = users.find((u) => u.refreshToken === refreshToken);

    if (!findUser) {
        return res.status(400).json({
            message: "Invalid refresh token"
        });
    }

    // Nullify both tokens
    findUser.refreshToken = null;
    findUser.accessToken = null;

    res.json({
        message: "User logged out successfully"
    });
});


 export default userRouter;
