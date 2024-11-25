# Use .NET 8.0 SDK for both base and build stages
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the entire project and build it
COPY AuthApi ./AuthApi
WORKDIR /src/AuthApi
RUN dotnet build -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Use runtime image for final app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment and expose ports
ENV ASPNETCORE_ENVIRONMENT Development
EXPOSE 80 443

ENTRYPOINT ["dotnet", "AuthApi.dll"]
