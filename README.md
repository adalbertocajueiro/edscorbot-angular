# Getting Started
This repository contains the front-end (microservice) of the EDScorbot project. The service is implemented as a Spring Boot/Java microservice. 

### Tools Information
This project has been developed using the following tools:
* NodeJS version 18.14.0 (NPM version 9.3.1)
* Angular CLI version 15.2.6

### Project structure
After downloading and extracting the project, the folder `edscorbot-angular` is the root folder of an Angular project with a specific folder/files structure

### The EDScorbot ecosystem
The EDScorbot project is an ecosystem composed by many microservices. The following figure illustrates these components. 

![The EDScorbot ecosystem](/images/ecosystem.png "The EDScorbot ecosystem")

Each microservice (except the Angular microservice) follows an API specification establishing the routes and the data exchanged. The Angular service, on the other hand, agrees on all specifications to interact suitably with the other microservices. Each one is briefly described as follows:

* `Mosquitto broker` - the communication layer for asynchronous applications. The broker is able to receive/send messages between publishers and subscribers. The angular and the C/C++ (controller) microservice interact with each other using this broker.

* `H2 database` - it is a microservice providing storage in a relational database. Users, trajectories and roles are stored in this microservice. This service can be replaced with other relational databases. Developers or maintainers do not need to worry about starting/stoping this service as it is handled by the Spring Boot/Java service.

* `Spring Boot/Java` - it is a microservice providing support for registration, authentication, users and  management. As the database is dedicated only for this microservice, it handles the start/stop of the H2 microservice transparently. This microservice follows [this API specification](https://app.swaggerhub.com/apis-docs/ADALBERTOCAJUEIRO_1/ed-scorbot-service_api/1.0.0) and is available as a [Github project](https://github.com/adalbertocajueiro/edscorbot-java) with detailed instructions on how to use it.

* `Flask/Python` - it is a microservice providing support for loading and applying useful conversions in content of NPY (Numpy) files. This microservice follows [this API specification](https://app.swaggerhub.com/apis-docs/ADALBERTOCAJUEIRO_1/ed-scorbot_api/1.0.0) and is available as a [Github project](https://github.com/adalbertocajueiro/edscorbot-py) with detailed instructions on how to use it.

* `C/C++` - it is a microservice representing a simulated robotic arm. It is useful for development and tests purposes before embedding the service into the arm. This microservice follows [this Async API specification](https://app.swaggerhub.com/apis-docs/ADALBERTOCAJUEIRO_1/ed-scorbot_async/1.0.0) and is available as a [Github project](https://github.com/adalbertocajueiro/edscorbot-c-cpp) with detailed instructions on how to use it. [REVISE]

* `Angular` - it is a microservice representing the application (user interface). This microservice follows all the previous API specifications to interact with the other services.  

### Installation

* If you do not have NodeJS installed in your machine, please follow the install instructions at [NodeJS Official site] (https://nodejs.org/en). 
* After installing NodeJS, install Angular CLI: open a terminal and type `npm install -g @angular/cli`. Depending on your platform, Admin privileges must be required
* After cloning the project, enter the folder `edscorbot-angular` and type `npm install` to install all dependencies.
* Open the project folder in Visual Studio Code (vscode). It might be possible vscode offers other extensions to be installed. Just accept it. you can also apply these steps using an integrated terminal inside vscode
* Open the file `src/environments/environment.development.ts` and check/adjust the values of the broker, the Python and the Java APIs.
* The server can be started in two ways: using proxy configuration or not. This influenciates the content of the environment variable `javaAPI.JAVA_API_URL`. For the moment, then Angular application connects correctly with the Java back-end only when usin proxy configuration. This is an Angular support to avoid CORS problem when connecting microservices.
* Open the file `proxy.conf.json`. The key `target` points to the root route where the edscorbot-java project is running. Adjust it if necessary.


### Running
As the Angular microservice is a top-level service of the ecosystem, it must be the last one to be started. The correct order for launching the services is listed as follows:

1. The first services that must be running are: `Mosquitto broker`, `Spring Boot/Java` and `Flask/Python`. They can be launched in any order. Remember that the `Spring Boot/Java` service already starts the `H2 database` service automatically.

2. The second service to be launched is `C/C++`. Follows the instructions of that project to to that.

3. Finally, laung the Angular service as follows:

    * Open a termina and go to the folder `edscorbot-angular` (this can be done inside in vscode). 
    * Run the command `npm start`. It will launch the microservice using the proxy configurations to avoid CORS problem with the Java microservice. If the service starts correctly, you should see the message such as:

    ```
     ** Angular Live Development Server is listening on localhost:PORT ...
    
     ✔ Compiled successfully
    ```

    * Open the URL http://localhost:PORT in your browser and enjoy the Web application.
    * You will be able to access all features of the application only if all microservices in the ecossystem are running: broker, python api, java api and arm's controller (C/C++ microservice)
    * There is a super user (`root/edscorbot`). Use it carefully!

### Reference Documentation
For further reference, please consider the following items:
* [EDScorbot Github Project](https://github.com/RTC-research-group/Py-EDScorbotTool) - the main Github project with details about the entire project and the low level code to control the robotic arm
* [EDScorbot Documentation](https://py-edscorbottool.readthedocs.io/en/latest/) - documentation about the entire project
* [EDScorbot Python API](https://github.com/adalbertocajueiro/edscorbot-py) - the Github project with details about the Python microservice
* [EDScorbot Java API](https://github.com/adalbertocajueiro/edscorbot-java) - the Github project with details about the Java microservice
* [NodeJS Official site](https://nodejs.org/en)
* [Angular CLI Overview and Command Reference](https://angular.io/cli)
* [Angular CLI](https://github.com/angular/angular-cli).
