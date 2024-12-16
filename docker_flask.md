# Typical run commands:
## build:
docker build -t <name> .
docker build -t flask-cnc-app .
## run:
docker run -p "PORT:PORT" -e PORT="XXXX" <name>
docker run -d -p 5001:5001 --name flask-appcontainer -e PORT=5001 flask-cnc-app

## miscellaneous
docker ps
docker images
docker stop <container-id>
docker run -d --name "name" -p 5001:5001 -e PORT=5001 cnc-flask-app  <-"Image_name"
docker container start "name"
docker logs "name"
a
### access container shell:
docker exec -it flask-cnc-app /bin/bash
docker stop flask-appcontainer
dockre rm flask-appcontainer
# pushin to registry:
docker tag flask-cnc-app dockerhubuser/dockerhub-repo
docker push dockerhubuser/dockerhub-repo