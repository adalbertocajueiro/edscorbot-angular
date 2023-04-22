export const environment = {
    broker: {
        //hostname: '192.168.1.104', //host running the broker
        hostname: 'localhost',
        port: 8080, //port of the broker listening to websockets
        clean: true, // Retain session
        connectTimeout: 400, // Timeout period
        reconnectPeriod: 390 // Reconnect period
    },

    pythonApi: {
        //The host root route where the edscorbot-py project is running
        PYTHON_API_URL: 'http://127.0.0.1:5000'
    },

    javaAPI: {
        //The host root route where the edscorbot-java project is running
        //If you are using proxy config (the application is started with npm start)
        //Then do not adjust this value
        //JAVA_API_URL: ''
        JAVA_API_URL: 'http://localhost:8081'
    }
};
