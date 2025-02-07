# Użyj oficjalnego obrazu PSQL jakjo bazy
FROM postgres:15

# Ustaw domyślne wartości dla zmiennych środowiskowych na podstawie naszych zmiennych
# Uwaga: oficjalny obraz PostgreSQL używa POSTGRES_USER i POSTGRES_PASSWORD.
# Poniżej przypisujemy te wartości na podstawie wartości przekazanych przez DB_USER i DB_PASSWORD.
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=kuba

ENV POSTGRES_DB=authappdb