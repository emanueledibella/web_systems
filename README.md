# Installation

Installation is simple! Just use docker image!

``
docker compose up
``

And that's all!

Db image automatically gets database.sql that contains all initial data and executes all its queries. \
At the same time app container is built with a fresh Maven installation, Maven configuration and libraries installation. \

At the end entrypoint executes the application with Maven