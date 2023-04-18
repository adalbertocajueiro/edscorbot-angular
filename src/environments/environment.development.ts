export const environment = {
    broker: {
        hostname: 'localhost', //host running the broker
        port: 8080, //port of the broker listening to websockets
        clean: true, // Retain session
        connectTimeout: 4000, // Timeout period
        reconnectPeriod: 4000 // Reconnect period
    },

    pythonApi: {
        //The host root route where the edscorbot-py project is running
        PYTHON_API_URL: 'http://127.0.0.1:5000'
    },

    javaAPI: {
        //The host root route where the edscorbot-java project is running
        //If you are using proxy config (the application is started with npm start)
        //Then do not adjust this value
        JAVA_API_URL: ''
    }
};
