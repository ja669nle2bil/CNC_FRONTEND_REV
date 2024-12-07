# DOCKER + ORCHESTRATION (WIP)
## RUNNING:
docker build -t authapi .
docker network create app-network
docker run -d --name authapi --network app-network -p 5002:80 authapi

### FROM MAIN ROOT:
docker build -t authapi -f AuthApi/Dockerfile .
docker run -d --name authapi -p 5002:80 authapi
docker run --env-file .env -d --name authapi -p 5002:80 authapi

# Start an existing container:
docker container start 'name'