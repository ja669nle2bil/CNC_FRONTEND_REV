# ASP.NET dockerfile.
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /
EXPOSE 80

# Use the .NET SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /
COPY ["AuthAPI.csproj", "/"]
RUN dotnet restore "/AuthAPI.csproj"
COPY . .
WORKDIR "/AuthAPI"
RUN dotnet build -c Release -o /build

# Publish the app
FROM build AS publish
RUN dotnet publish -c Release -o /publish

# Run the app
FROM base AS final
WORKDIR /
COPY --from=publish /publish .

# Prevent variables that can be overridden at runtime
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "AuthAPI.dll"]