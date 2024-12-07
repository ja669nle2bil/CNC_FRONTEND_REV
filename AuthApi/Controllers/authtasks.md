# 1. Register a user
curl -X POST http://localhost:5265/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"user1", "passwordHash":"password1"}'

# 2. Login
TOKEN=$(curl -X POST http://localhost:5265/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"user1", "passwordHash":"password1"}' | jq -r '.token')

### OR:
curl -X POST http://localhost:5265/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser", "password":"testpass"}'

# 3. Check tokens
curl -X GET http://localhost:5265/api/auth/check-tokens \
-H "Authorization: Bearer $TOKEN"

# 4. Add tokens
curl -X POST http://localhost:5265/api/auth/add-tokens \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '15.0'

# 5. Use token
curl -X POST http://localhost:5265/api/auth/use-token \
-H "Authorization: Bearer $TOKEN"

## packages:
dotnet add package Microsoft.IdentityModel.Tokens
dotnet add package Microsoft.IdentityModel.JsonWebTokens
