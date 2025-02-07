# Instrukcja uruchomienia aplikacji

## 1. Wnioski

Przed rozpoczęciem instalacji upewnij się, że masz zainstalowane następujące komponenty:

---

### 1.1: Docker

#### Instalacja Dockera:

- **Windows i macOS**: Pobierz i zainstaluj Docker Desktop
- **Linux (Ubuntu)**:
  
      sudo apt update && sudo apt install -y docker.io
      sudo systemctl start docker
      sudo systemctl enable docker

---

### 1.2: PostgreSQL 

Potrzebujesz PostgreSQL jako bazy danych. Możesz go zainstalować ręcznie lub przy pomocy Dockera.

#### Instalacja PostgreSQL na Windows (PowerShell):

    winget install -e --id PostgreSQL.PostgreSQL

#### Instalacja PostgreSQL na macOS:

    brew install postgresql
    brew services start postgresql

#### Instalacja PostgreSQL na Linuxie:

    sudo apt install postgresql postgresql-contrib
    sudo systemctl start postgresql

#### Instalacja przy pomocy Dockera (w katalogu postgresdocker, jest Dockerfile).

    cd postgresdocker

    docker build -t psqlx .

    docker run --name my-postgres -e POSTGRES_USER=cncuser -e POSTGRES_PASSWORD=cncpassword -p 5432:5432 -d psqlx

#### Dane konfiguracyjne bazy danych (ustawienia środowiskowe, przeznaczone tylko do lokalnych testów!!!):

    DB_HOST=host.docker.internal
    DB_PORT=5432
    DB_NAME=cncdatabase
    DB_USER=cncuser
    DB_PASSWORD=cncpassword

---

### 1.3: Node.js i npm

Node.js i npm są wymagane do uruchomienia frontendowej aplikacji.

#### Instalacja Node.js i npm:

Pobierz i zainstaluj Node.js z oficjalnej strony [nodejs.org](https://nodejs.org/en/download/current), lub użyj komendy:

- **Windows**:

      winget install OpenJS.NodeJS

- **macOS**:

      brew install node

- **Linux**:

      sudo apt update
      sudo apt install nodejs npm

#### Sprawdzanie wersji po instalacji:

    node -v
    npm -v

---

### 1.4: Wybrany edytor kodu

Zalecane edytory: Visual Studio Code, IntelliJ IDEA, WebStorm.

---

## 2. Uruchomienie aplikacji

Po zainstalowaniu wszystkich wymaganych narzędzi wykonaj poniższe kroki:

### 2.1: Uruchomienie Backendów

Aplikacje backendowe (Python API i C# API) są skonteneryzowane w Dockerze.

#### Uruchomienie Python-API

Przejdź do katalogu **Python-API** i zbuduj obraz Dockera:

    docker build -t python-api:latest .

Następnie uruchom kontener:

    docker run -it -p 5000:5000 python-api

#### Uruchomienie C#-API

Przygotuj zmienne środowiskowe, umieszczając plik **.env** w folderze **CNC_APP**.

Następnie, w oddzielnym terminalu, w katalogu **CNC_APP**, zbuduj obraz Dockera:

    docker build -t csharp-api -f AuthApi/Dockerfile .

Po czym uruchom kontener:

    docker run -it -p 8080:8080 --env-file .env csharp-api

---

### 2.2: Uruchomienie Frontendu

Frontend jest uruchamiany lokalnie poprzez konfigurator oraz interfejs **Expo + Metro**.

#### Konfiguracja **.env**

Upewnij się, że plik **.env** znajduje się w katalogu głównym aplikacji **CNC_APP**.

#### Instalacja zależności i uruchomienie aplikacji:

    npm install
    npx expo start -c

Teraz musisz zatrzymać aplikację i przekopiować adres z zrzutu ekranu.

Następnie wklej go do konsoli po wywołaniu skryptu:

    node update-address.js

Aplikacja powinna być już gotowa do działania lokalnie. Uruchom ją ponownie:

    npx expo start -c

---

## 3. Testowanie aplikacji

### 3.1: Test wersji przeglądarkowej

Aby przetestować aplikację lokalnie przy użyciu przeglądarki, otwórz nowe okno i przejdź pod adres:

    localhost:8081

Następnie utwórz nowego użytkownika poprzez okno rejestracji. Jesteś gotowy do testów aplikacji **CNCodifier**.

Przykładowe pliki PDF do testów znajdują się w folderze **TEST_PDF**.

---

### 3.2: Test wersji mobilnej

Aby przetestować aplikację na urządzeniu mobilnym, pobierz aplikację **Expo Go** ze sklepu App Store lub Google Play.

Następnie zeskanuj kod QR przedstawiony na zrzucie ekranu.

Podobnie jak wcześniej, jeśli nie istnieje, utwórz nowego użytkownika przez okno rejestracji. Wówczas aplikacja **CNCodifier** będzie gotowa do testów.

Tak jak wcześniej, przykładowe pliki PDF znajdują się w folderze **TEST_PDF**.

Skonwertowany output **G-Code** można sprawdzić i ocenić za pomocą wybranego symulatora. Rekomendowany:

[https://nraynaud.github.io/webgcode/](https://nraynaud.github.io/webgcode/)
