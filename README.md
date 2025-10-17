## TODO

- [x] Install GraphQL
- [Install React serve route]
- [x] Install MQTT client library
- Connect to databse(es)
- Setup RPC client with MQTT

## Development

Open SSH tunnel to get access to TimeScaleDB `ssh -N -L 5433:127.0.0.1:5433 energy`

## Features

- Status abrufen (heartbeat)
- Firmeware update
- Remote shell
- Anwendungs update
- Versionierung?
- Sheduler that calls RPC functions?
- Webhooks?
- User providable Server side logic?

## Motivation

- Bequeme Entwicklung ohne lästige Kabelverbindung
- Entwicklung von unterwegs und von überall aus
- Schnelles ausrollen von updates
- Einfache OTA updates
- Entwicklung auch von iPad (das keine entwicklung via USB unterstützt, da serielle schnittstelle nicht öffentlich)
- Einfaches Monitoring für schnelles und gezieltes Einschreiten bei Fehlern / Problemen


## Install

Add mqtt.json to resources folder

