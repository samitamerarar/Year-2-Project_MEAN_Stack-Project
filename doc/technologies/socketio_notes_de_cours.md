```
Client                                              Serveur
+------------------------------+                +------------------------------+
| '.' <- prise(socket) ouvert  | -------------> |    namespace ouvert          |
|                              |                |  +------------------+        |
|                              |                |  |rooms             |        |
|  ^---------------------------+--------------- |  |+--------+        |        |
|                              |               \+--+>'.'     |        |        |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
|                              |                |                              |
+------------------------------+                +------------------------------+
```

Lorsqu'on ouvre un socket sur le client, on y associe une addresse. À ce moment
là, le Serveur ouvre un namespace, dans lequel il y a une room qui contient le
socket pairé avec celui du client. On peut attacher des fonctions (callback) aux
sockets pour réagir à certains événement.

# SocketIO

## Créé un socket:

Client:
```javascript
let socket = io('http://localhost');
```
Serveur:
```javascript
const io = require('socket.io')();
// or
const Server = require('socket.io');
const io = new Server();
```

## Client

Envoyer un message (méthodes d'un socket):
  - `.send(data: any[, ...])`: Envoi un message sans événements d'attaché.
    (Événement 'message' par défaut)
  - `.emit('event_name', data: any[, ...])`: Envoi un message attaché à un
    événement.

Recevoir un message (méthode d'un socket):
  - `.on('event_name', callback: (arg1: any[, arg2: any[, ...]]) => void)`

## Serveur

Recevoir un événement (message):
  - `io.on('connect', callback: (socketToClient, arg1[, arg2[, ...]]))`: Attache un callback à l'événement 'connect' 
    qui sera lancé lorque le serveur recevera une nouvelle connection.
  - `io.of('namespace').on('event_name', callback)`: Attach un callback à un
    événement lancé depuis un namespace.

Émettre aux clients: (On ne peut envoyer QU'À des namespace, des rooms ou des
sockets)
  - `io.to('namespace').emit('event_name', someData: any[, ...])`: Envoi un
    message à tous les sockets du namespace 'namespace'.
  - `io.to('namespace').to('room').emit(...)`: Envoi un message à tous les
    socket du room 'room' dans le namespace 'namespace'.

Faire joindre une room à un socket:
```typescript
io.on('connect', (socket) => {
    socket.join('myroom');
});
```

