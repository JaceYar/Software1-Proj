package edu.baylor.cs;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;

import java.sql.Connection;
import java.sql.DriverManager;

import static edu.baylor.cs.db.Tables.*;

public class App {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite:data/booking.db");
        DSLContext db = DSL.using(conn, SQLDialect.SQLITE);

        // Only insert if table is empty
        if (db.fetchCount(USERS) == 0) {
            db.insertInto(USERS, USERS.EMAIL, USERS.NAME)
                .values("john@example.com", "John Doe")
                .values("epstein@theisland.com", "Jeffery Epstein")
                .execute();
            System.out.println("Inserted sample users");
        }

        var users = db.selectFrom(USERS).fetch();

        for (var user : users) {
            System.out.println("Found user: " + user.getName() + " (" + user.getEmail() + ")");
        }

        conn.close();
    }
}
