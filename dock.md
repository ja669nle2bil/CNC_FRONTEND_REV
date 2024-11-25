# Typical run commands:
## build:
docker build -t <name> .
## run:
docker run -p "PORT:PORT" -e PORT="XXXX" <name>
## miscellaneous
docker ps
docker images
docker stop <container-id>
docker run -d --name "name" -p 5001:5001 -e PORT=5001 cnc-flask-app  <-"Image_name"
