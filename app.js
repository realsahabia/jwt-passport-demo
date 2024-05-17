import express from "express";
import userRouter from "./routes/auth.js";
import initializePassport from "./passport-config.js";
import { users } from "./routes/auth.js";

const passport = initializePassport(users)

const app =express();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", userRouter);

app.get("/", (req, res) =>{
    res.send("Hello, world");   
})

app.get("/protected", passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.send("You have access a protected route!");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})