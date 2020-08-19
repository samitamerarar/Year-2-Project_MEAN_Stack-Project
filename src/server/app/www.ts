/**
 * www.ts - Configure le serveur Node en vue d'accueillir l'application Express.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import { Application } from './app';
import * as http from 'http';
import { Logger } from '../../common/src/logger';

const application: Application = Application.bootstrap();

// Configuration du port d'écoute
const appPort = normalizePort(process.env.PORT || '3000');
application.app.set('port', appPort);

// Création du serveur HTTP.
const server = http.createServer(application.app);

/**
 *  Écoute du traffic sur le port configuré.
 */
server.listen(appPort);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalise le port en un nombre, une chaîne de caractères ou la valeur false.
 *
 * @param val Valeur du port d'écoute.
 * @returns Le port normalisé.
 */
function normalizePort(val: number|string): number|string|boolean {
  const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if  (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

/**
 * Se produit lorsque le serveur détecte une erreur.
 *
 * @param error Erreur interceptée par le serveur.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') { throw error; }
  const bind = (typeof appPort === 'string') ? 'Pipe ' + appPort : 'Port ' + appPort;
  switch (error.code) {
    case 'EACCES':
      Logger.getLogger().error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.getLogger().error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Se produit lorsque le serveur se met à écouter sur le port.
 */
function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  Logger.getLogger().log(`Listening on ${bind}`);
}
