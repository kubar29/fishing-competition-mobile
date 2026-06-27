# Fishing Competition System – Mobile Application

## Opis projektu

Fishing Competition System Mobile to aplikacja mobilna stworzona w ramach projektu inżynierskiego. Aplikacja wspiera organizację zawodów wędkarskich oraz umożliwia obsługę zawodów zarówno przez uczestników, jak i sędziów.

System współpracuje z autorskim backendem REST API opartym o Node.js, Express, Prisma ORM oraz PostgreSQL.

---

## Technologie

### Frontend

* React Native
* Expo
* TypeScript
* Expo Router
* Context API
* Axios
* SecureStore
* AsyncStorage
* Expo Haptics

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* JWT Authentication

---

## Funkcjonalności

### Użytkownik

* Rejestracja
* Logowanie
* Automatyczne logowanie
* Wylogowanie
* Lista zawodów
* Wyszukiwanie zawodów
* Szczegóły zawodów
* Klasyfikacja zawodników
* Profil użytkownika

### Sędzia

* Panel sędziego
* Wybór tury i sektora
* Lista zawodników w sektorze
* Edycja wagi ryb
* Edycja punktów karnych
* Podgląd klasyfikacji wyliczany lokalnie
* Generowanie wyników sektora
* Blokada edycji po zatwierdzeniu sektora

---

## Architektura aplikacji

Projekt został podzielony na warstwy:

* components
* screens
* context
* api
* types
* utils
* constants

Komunikacja z backendem odbywa się poprzez REST API z wykorzystaniem biblioteki Axios.

---

## Role użytkowników

### USER

* przeglądanie zawodów
* wyszukiwanie zawodów
* podgląd klasyfikacji
* podgląd szczegółów zawodów

### JUDGE

* wszystkie funkcje użytkownika
* panel sędziego
* edycja wyników zawodników
* generowanie wyników sektora

---

## Funkcje natywne

Aplikacja wykorzystuje natywne możliwości urządzenia:

* SecureStore – bezpieczne przechowywanie tokenu JWT
* AsyncStorage – pamięć podręczna listy zawodów
* Expo Haptics – informacja zwrotna przy najważniejszych operacjach

---

## Autoryzacja

Aplikacja wykorzystuje JWT.

Po zalogowaniu token zapisywany jest w SecureStore i automatycznie odczytywany przy ponownym uruchomieniu aplikacji.

---

## Panel sędziego

Workflow sędziego:

1. Wybór zawodów
2. Wybór tury
3. Wybór sektora
4. Pobranie listy startów
5. Edycja wagi oraz punktów karnych
6. Lokalny podgląd klasyfikacji
7. Wygenerowanie wyników sektora
8. Blokada edycji zatwierdzonego sektora

---

## Struktura projektu

```
app/
src/
  api/
  components/
  constants/
  context/
  types/
  utils/
assets/
```

---

## Uruchomienie aplikacji

### Wymagania

Przed uruchomieniem projektu należy zainstalować:

- Node.js 20+
- npm
- Expo CLI (opcjonalnie)
- Expo Go (Android/iOS) lub emulator Android Studio
- Uruchomiony backend Fishing Competition System

### Instalacja

Sklonuj repozytorium:

```bash
git clone <adres_repozytorium>
cd fishing-mobile-app
```

Zainstaluj zależności:

```bash
npm install
```

### Konfiguracja

W głównym katalogu projektu utwórz plik `.env`:

```env
EXPO_PUBLIC_API_URL=http://ADRES_IP_KOMPUTERA:3000/api
```

Przykład:

```env
EXPO_PUBLIC_API_URL=http://192.168.43.240:3000/api
```

> Telefon oraz komputer muszą znajdować się w tej samej sieci lokalnej.

### Uruchomienie

Uruchom aplikację:

```bash
npx expo start
```

lub po zmianie pliku `.env`:

```bash
npx expo start -c
```

Następnie:

- zeskanuj kod QR aplikacją **Expo Go**, lub
- uruchom projekt na emulatorze Android Studio.

### Backend

Aplikacja wymaga uruchomionego backendu REST API.

Backend powinien być dostępny pod adresem określonym w pliku `.env`, np.:

```
http://192.168.43.240:3000/api
```

Przed uruchomieniem aplikacji należy:

1. uruchomić bazę PostgreSQL (Docker),
2. uruchomić serwer backend,
3. upewnić się, że endpoint API jest dostępny z urządzenia mobilnego.



---

## Autor

Jakub Rusek

Projekt wykonany w ramach pracy inżynierskiej.

