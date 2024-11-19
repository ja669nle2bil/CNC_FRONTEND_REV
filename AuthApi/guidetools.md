## Requirements:
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
# Version check:
dotnet ef --version

# Run migrations tasks:
dotnet ef migrations add InitialCreate
dotnet ef database update

# All dotnet packages downloaded:
dotnet list package

# Restore dependencies, to ensure all of them're resolved:
dotnet restore