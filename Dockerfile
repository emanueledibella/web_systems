
RUN mvn dependency:purge-local-repository
RUN mvn clean install