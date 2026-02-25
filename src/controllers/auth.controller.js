import { supabase } from "../config/supabase.js";
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import Joi from 'joi';

const signupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export async function signup(req, res) {
    try {
        const { error: validationError } = signupSchema.validate(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError.details[0].message });
        }

        const { email, password, username } = req.body;

        const { data: existingUserByEmail } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "User with this email already exists" })
        }

        const { data: existingUserByUsername } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "User with this username already exists" })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/PROBOY.jpg", "/PROGRL.jpg"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const { data: newUser, error } = await supabase
            .from('users')
            .insert([
                { email, password: hashedPassword, username, image }
            ])
            .select()
            .single();

        if (error) throw error;

        generateTokenAndSetCookie(newUser.id, res);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: encrypt(newUser.email),
                image: newUser.image
            }
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function login(req, res) {
    try {
        const { error: validationError } = loginSchema.validate(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError.details[0].message });
        }

        const { email, password } = req.body;

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ success: false, message: "Invalid credentials" })
        }

        const isPasswordCorrect = await bcryptjs.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        generateTokenAndSetCookie(userData.id, res);

        res.status(200).json({
            success: true,
            user: {
                id: userData.id,
                username: userData.username,
                email: encrypt(userData.email),
                image: userData.image
            }
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-task", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        res.status(200).json({ success: true, message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function authCheck(req, res) {
    try {
        const user = { ...req.user };
        if (user.email) user.email = encrypt(user.email);
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in authCheck controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
