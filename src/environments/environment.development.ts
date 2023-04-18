export const environment = {
    hostname: 'localhost', //host running the broker
    port: 8080, //port of the broker listening to websockets
    clean: true, // Retain session
    connectTimeout: 4000, // Timeout period
    reconnectPeriod: 4000 // Reconnect period
};
