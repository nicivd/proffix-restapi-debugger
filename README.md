# Proffix REST API Debugger

Der Proffix REST API Debugger ist ausschliesslich für die Proffix REST API von Px5 konzipiert. Man verbindet sich mit einer Proffix REST API Instanz und loggt sich mit einem Proffix Benutzer ein. Anschliessend kann man Requests(Anfragen) an die verbundene Proffix REST API senden und erhält die Responses (Antworten) als "Log-Einträge" abgebildet.

## Anforderungen an die Entwicklungsumgebung

* Lokale Proffix Px5 Installation
  * Gültige Lizenz
  * Proffix Datenbank
* Laufende und erreichbare Proffix REST API 
* IDE (z.B.Visual Studio Code)

## Enwicklungsumgebung in Betrieb nehmen

### 1. Projekt initialisieren
[Repository](https://github.com/nicivd/proffix-restapi-debugger) herunterladen oder Klonen. Den Befehl "npm install" ausführen um alle nötigen npm-Packages herunterzuladen. 

### 2. Proffix REST API Library installieren
[Proffix REST API Library](https://github.com/PROFFIX-NET/restapi-angular-library) als npm-Package installieren oder herunterladen.
Achtung: Die Proffix REST API Library ist vom npm-Package ["Moment"](https://www.npmjs.com/package/moment) Abhängig. 

### 3. Proffix REST API Debugger starten
Mit dem Befehl "ng serve" wird der Proffix REST API Debugger lokal gestartet. 

## Veröffentlichung der Entwicklungsumgebung
Der Proffix REST API Debugger wurde mit Github-Pages Veröffentlicht. Es kann das npm-Package ["angular-cli-ghpages" ](https://www.npmjs.com/package/angular-cli-ghpages#quickstart-local) verwendet werden, um das Veröffentlichen der Angular Applikation zu vereinfachen. Der Proffix REST API Debugger ist under [diesem Link](https://nicivd.github.io/proffix-restapi-debugger) aufrufbar.


