FROM openjdk:17.0-slim
WORKDIR /app
COPY . /app
RUN apt-get update
RUN apt-get install -y maven
RUN mvn dependency:purge-local-repository
RUN mvn clean install
EXPOSE 8080
ENTRYPOINT ./entrypoint.sh
