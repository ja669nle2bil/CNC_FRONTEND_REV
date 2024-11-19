## GRANT PRIVILEGES FOR USER.
GRANT USAGE ON SCHEMA public TO xxxuser;
GRANT CREATE ON SCHEMA public TO xxxhuser;

ALTER SCHEMA public OWNER TO xxxuser;

GRANT ALL PRIVILEGES ON DATABASE xxxdb TO xxxuser;

# Open up psql, guide;
psql -U 'xxx'
\c 'appname';
\du 'xxxuser'; 

## Test run for database using API endpoints.
curl -X POST http://localhost:PORT/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'

curl -X POST http://localhost:PORT/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'