import sqlite3

def create_user_database():
    # Connect to SQLite database (creates file if it doesn't exist)
    conn = sqlite3.connect('user_database.db')

    # Create a cursor object to execute SQL commands
    cursor = conn.cursor()

    # SQL command to create the 'users' table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Unique ID for the user
        username TEXT NOT NULL,                  -- Username of the user
        eth_add TEXT NOT NULL UNIQUE,              -- Email, must be unique
        hashed_pw TEXT NOT NULL,           -- Hashed password for security
        role TEXT NOT NULL                 -- Role
    );
    """
    # Execute the SQL command
    cursor.execute(create_table_query)

    # Commit changes and close the connection
    conn.commit()
    conn.close()

    print("Database and table created successfully.")

# Run the function to create the database and table
if __name__ == "__main__":
    create_user_database()
