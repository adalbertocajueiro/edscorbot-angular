# Getting Started
This repository contains the front-end (microservice) of the EDScorbot project. The service is implemented as a Spring Boot/Java microservice. 

### Tools Information
This project has been developed using the following tools:
* NodeJS version 18.14.0 (NPM version 9.3.1)
* Angular CLI version 15.2.6

### Project structure
After downloading and extracting the project, the folder `edscorbot-angular` is the root folder of an Angular project with a specific folder/files structure


### Installing and running
* If you do not have NodeJS installed in your machine, please follow the install instructions at [NodeJS Official site] (https://nodejs.org/en). 
* Install Angular CLI: open a terminal and type `npm install -g @angular/cli`. Depending on your platform, Admin privileges must be required
* Enter the folder `edscorbot-angular` and type `npm install` to install all dependencies.
* Open the project folder in Visual Studio Code (vscode). It might be possible vscode offers other extensions to be installed. Just accept it.
* Open the file `src/environments/environment.development.ts` and check/adjust the values of the broker, the Python and the Java APIs.
* The server can be started in two ways: using proxy rewrite or not. This influenciates the content of the environment variable `javaAPI.JAVA_API_URL`. For the moment, then Angular application connects correctly with the Java back-end only qhen usin proxy rewrite. This is an Angular support to aviod CORS problem qhen connecting microservices.
* Open the file `proxy.conf.json`. The key `target` points to the root route where the edscorbot-java project is running. Adjust it if necessary.
* Open a terminal. Enter the folder edscorbot-angular and run the command `npm start`. It will launch the microservice using the proxy configurations to avoid CORS problem with the Java microservice. If the service starts correctly, you should see the message such as:

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
