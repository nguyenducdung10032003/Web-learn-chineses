import mysql from "mysql2/promise";

// Tạo connection pool (tốt hơn connect thường)
const pool = mysql.createPool({
  host: "localhost",   // hoặc 127.0.0.1
  user: "root",        // user MySQL của bạn
  password: "368925", 
  database: "learn-chinese",
});

export default pool;
