Oczywiście, poniżej przedstawiam przykładowy plik `README.md` dla komponentu bazy danych PostgreSQL, który opisuje jego przeznaczenie oraz sposób uruchomienia z użyciem Dockera:

---

# **PostgreSQL Database Component**

Ten komponent dostarcza obraz Docker dla bazy danych PostgreSQL, niezbędnej do działania aplikacji. Umożliwia uruchomienie instancji PostgreSQL z dostosowanymi parametrami użytkownika i hasła.

## **Wymagania wstępne**

- **Docker**: Upewnij się, że Docker jest zainstalowany na Twoim systemie. Instrukcje instalacji znajdziesz na oficjalnej stronie Dockera: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

## **Budowanie obrazu**

1. **Budowanie obrazu Docker**:
   ```bash
   docker build -t psqlx .
   ```

   Powyższa komenda buduje obraz Docker na podstawie dostarczonego pliku `Dockerfile` i nadaje mu tag `psqlx`.

## **Uruchamianie kontenera**

Aby uruchomić kontener PostgreSQL z niestandardowym użytkownikiem i hasłem, użyj poniższej komendy:

```bash

docker run -d \
  -e DB_USER=postgres \
  -e DB_PASSWORD=kuba \
  -p 5432:5432 \
  psqlx
```

```bash
docker run -d -e DB_USER=moj_uzytkownik -e DB_PASSWORD=moje_haslo -p 5432:5432 psqlx
```

**Parametry**:

- `-d`: Uruchamia kontener w trybie odłączonym (w tle).
- `-e DB_USER=moj_uzytkownik`: Ustawia nazwę użytkownika bazy danych.
- `-e DB_PASSWORD=moje_haslo`: Ustawia hasło dla użytkownika bazy danych.
- `-p 5432:5432`: Mapuje port 5432 kontenera na port 5432 hosta, umożliwiając dostęp do bazy danych z hosta.
- `psqlx`: Nazwa obrazu Docker zbudowanego w poprzednim kroku.

## **Dostęp do bazy danych**

Po uruchomieniu kontenera, baza danych PostgreSQL będzie dostępna pod adresem `localhost` na porcie `5432`. Możesz połączyć się z nią za pomocą dowolnego klienta PostgreSQL, używając ustawionych wcześniej poświadczeń (`DB_USER` i `DB_PASSWORD`).

Przykład połączenia za pomocą narzędzia `psql`:

```bash
psql -h localhost -U moj_uzytkownik -W
```

Po podaniu hasła będziesz mógł wykonywać zapytania do bazy danych.

## **Trwałość danych**

Domyślnie, dane przechowywane w kontenerze Docker nie są trwałe i zostaną utracone po zatrzymaniu lub usunięciu kontenera. Aby zapewnić trwałość danych, możesz użyć wolumenów Docker:

```bash
docker run -d \
  -e DB_USER=postgres \
  -e DB_PASSWORD=kuba \
  -v pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  psqlcnc
```

Powyższa komenda tworzy i montuje wolumen `pgdata`, który przechowuje dane bazy danych, zapewniając ich trwałość między restartami kontenera.

## **Uwagi**

- Upewnij się, że port `5432` nie jest już używany przez inną usługę na Twoim hoście.

---