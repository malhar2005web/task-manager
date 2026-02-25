import { supabase } from "../config/supabase.js";
import Joi from 'joi';

const taskSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().allow('', null).max(500),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').default('TODO'),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').default('MEDIUM'),
    dueDate: Joi.date().allow(null)
});

export async function createTask(req, res) {
    try {
        const { error: validationError } = taskSchema.validate(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError.details[0].message });
        }

        const { title, description, status, priority, dueDate } = req.body;
        const userId = req.user.id;

        const { data: task, error } = await supabase
            .from('tasks')
            .insert([
                {
                    title,
                    description,
                    status: status || 'TODO',
                    priority: priority || 'MEDIUM',
                    due_date: dueDate,
                    user_id: userId
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, task });
    } catch (error) {
        console.log("Error in createTask controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getTasks(req, res) {
    try {
        const userId = req.user.id;
        const { status, priority, search, page = 1, limit = 10 } = req.query;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('tasks')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (priority) query = query.eq('priority', priority);
        if (search) query = query.ilike('title', `%${search}%`);

        const { data: tasks, count, error } = await query
            .range(from, to);

        if (error) throw error;

        res.status(200).json({
            success: true,
            tasks,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.log("Error in getTasks controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        const userId = req.user.id;

        const { data: task, error } = await supabase
            .from('tasks')
            .update({ title, description, status, priority, due_date: dueDate })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({ success: true, task });
    } catch (error) {
        console.log("Error in updateTask controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.log("Error in deleteTask controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
