package edu.baylor.cs;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;

import java.sql.Connection;
import java.sql.DriverManager;

import static edu.baylor.cs.db.Tables.*;

public class App {
    public static void main(String[] args) throws Exception {
        // Connect to SQLite database
        Connection conn = DriverManager.getConnection("jdbc:sqlite:data/booking.db");
        DSLContext db = DSL.using(conn, SQLDialect.SQLITE);

        // Insert a user (like Drizzle's db.insert())
        db.insertInto(USERS, USERS.EMAIL, USERS.NAME)
            .values("john@example.com", "John Doe")
            .execute();

        // Query users (like Drizzle's db.select())
        var users = db.selectFrom(USERS)
            .where(USERS.EMAIL.eq("john@example.com"))
            .fetch();

        for (var user : users) {
            System.out.println("Found user: " + user.getName() + " (" + user.getEmail() + ")");
        }

        conn.close();
    }
}
