const db = require("../config/db");

class ClassAttendance {
    // Create a new attendance record
    static async createAttendance(user_id, class_date, status = "present") {
        return new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO class_attendance (user_id, class_date, status) VALUES (?, ?, ?)",
                [user_id, class_date, status],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }

    // Get attendance by user id
    static async getAttendanceByUser(user_id) {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM class_attendance WHERE user_id = ?",
                [user_id],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }

    // Get all attendance records (Admin only)
    static async getAllAttendance() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM class_attendance", (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Update attendance record (Admin only)
    static async updateAttendance(id, status) {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE class_attendance SET status = ? WHERE id = ?",
                [status, id],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }

    // Delete attendance record (Admin only)
    static async deleteAttendance(id) {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM class_attendance WHERE id = ?",
                [id],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }
}

module.exports = ClassAttendance;