import psycopg2
from psycopg2 import Error

try:
    # Connect to PostgreSQL
    connection = psycopg2.connect(
        database="Mentors_Booking",
        user="postgres",
        password="Roll02@?",
        host="localhost",
        port="5432"
    )
    
    # Create cursor
    cursor = connection.cursor()
    
    # Print PostgreSQL version
    cursor.execute("SELECT version();")
    record = cursor.fetchone()
    print("✅ Successfully connected to PostgreSQL")
    print(f"PostgreSQL version: {record[0]}\n")
    
    # Check current database
    cursor.execute("SELECT current_database();")
    db_name = cursor.fetchone()
    print(f"✅ Connected to database: {db_name[0]}")
    
    # List all tables (should be empty initially)
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    tables = cursor.fetchall()
    print(f"\n📊 Current tables in database: {len(tables)}")
    if tables:
        for table in tables:
            print(f"   - {table[0]}")
    else:
        print("   (No tables yet - will be created after migrations)")
    
except Error as e:
    print(f"❌ Error connecting to PostgreSQL: {e}")
    print("\nTroubleshooting tips:")
    print("1. Make sure PostgreSQL service is running")
    print("2. Verify database name: Mentors_Booking")
    print("3. Check password is correct: Roll02@?")
    print("4. Ensure port 5432 is not blocked")
    
finally:
    if 'connection' in locals():
        cursor.close()
        connection.close()
        print("\n✅ PostgreSQL connection closed")