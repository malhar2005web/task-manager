import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-task"];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
        }

        // Fetch user from Supabase 'users' table
        const { data: user, error } = await supabase
            .from('users')
            .select('id, username, email, image')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
