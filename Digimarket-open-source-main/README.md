# <img src="http://3.16.215.131/static/media/Recurso_15.7cdbcd0d13f9ee14de38.png" height="150" width="150"></img> Digimarket
<img src="https://user-images.githubusercontent.com/1287634/235761702-d32e6eb7-2df7-4a5f-81ee-55178d44d6c8.png" align="left" height="100" width="480"></img></br></br>


</br>
</br>

### Introduction:
Welcome to our Digimarket project, designed specifically for kids! As the world continues to shift towards digital learning, it is more important than ever to provide high-quality educational resources that are both engaging and accessible. Our platform aims to do just that, offering a fun and interactive way for children to learn and grow from the comfort of their own homes while simulating the in-person classroom experience as much as possible.

With our platform, organizations can collaborate with their all team members, parents and students in a private workspace and modify roles and responsibilities of each member as per their needs. From creating lessons to scheduling and using lesson’s content in interactive classrooms, every step can be handled through the platform.


Through a combination of videos, games, quizzes, and other interactive activities, our platform provides a comprehensive educational experience that is tailored to the unique needs and interests of children. We believe that education should be accessible to all, regardless of background or location. That's why our platform is designed to be easily accessible from any device with an internet connection.


### Objectives:
1.	Providing facility for organizations to setup their own workspace.
2.	Providing an interactive and engaging learning experience that is tailored to the needs and interests of kids.
3.	Supporting the acquisition of knowledge and information in a fun and engaging way.
4.	Enhancing student engagement and motivation through the interactive learning activities.
5.	Supporting personalized learning by providing a variety of resources and tools to meet the diverse learning needs of students.
6.	Providing teachers with a platform to monitor and assess student progress, and to provide feedback and support as needed.
7.	Providing remote classrooms that simulate real classroom experience.
8.	Design curriculum with all the supporting material that is required to be included in lessons
9.	Managing offered courses of an organization
10.	Creating, managing lesson schedules along with generating personal schedule for each user.


### Design Principles:

1.	User-Centered Design: Digimarket is designed with the needs and preferences of the target audience in mind.
2.	Accessibility: The system will be accessible to users of all abilities and should comply with accessibility standards.
3.	Consistency: The system will be designed with a consistent interface and navigation to provide a cohesive and user-friendly experience.
 
4.	Simplicity: The system will be designed with a simple and intuitive interface to minimize confusion and cognitive overload.

### Methodologies:

1.	Agile Development: This system developed using an agile methodology that emphasizes collaboration, flexibility, and rapid iteration.
2.	User Testing: This system tested with a group of representative users to identify usability issues and areas for improvement.
3.	Iterative Design: The system designed iteratively, with frequent feedback from stakeholders to guide the development process.

### Implementation:

#### Software Components:
The core component of Digimarket system, which manages, organizations, course content, course schedule, attendance, online classroom
1.	Jitsi Meet:
Used for live online classes, audio and video, screen sharing, whiteboard, and chat, which make it easier for teachers and students to collaborate and share information.

2.	Socket.IO:
It is often used for online classes because it allows for real-time communication between the teacher and students. Socket.IO is a library that enables bidirectional communication between a web browser and a server in real-time.
In an online class setting, this means that the teacher can send real-time updates to the students' such as quizzes, or announcements. Socket.IO also allows for chat and messaging between students and the teacher, providing an interactive and collaborative learning experience.
With Socket.IO, teachers can see in real-time how students are responding to their lessons, which helps them adjust their teaching style and materials as needed.


#### Hardware Components:
1.	Server Infrastructure:
The server infrastructure of Digimarket on AWS (Amazon Web Services) typically consists of a combination of AWS services that provide the necessary computing and storage to run the system.

* Amazon EC2 (Elastic Compute Cloud): This service provides virtual servers (EC2 instances) that use to host the Digimarket Project. EC2 instances can be easily scaled up or down based on demand.
 
* 	Amazon S3 (Simple Storage Service): This service provides scalable and durable object storage for the Digimarket project, such as storing images and files.
* 	Amazon RDS (Relational Database Service): This service provides managed relational databases for the Digimarket project, such as MySQL which can be used to store and manage user’s data, course materials, and other information.


#### List of libraries and frameworks:
*	React.js library : Used for frontend development 

*	Material UI library : Used for styling react component

*	Jitsi Meet : Used for online classroom

*	Socket.IO: Used for real time communication between teacher and students.

*	Node.js: Used for creating socket server.

*	.Net framework : Used for backend development

* 	MySQL: Used for data management.

#### Deployment and hosting requirements:
*	Amazon EC2 service is used for virtual servers (EC2 instances) that deploy the Digimarket Project.

*	Digimarket database use an AWS RDS (Relational Database Service). MySQL database is used for data management.

*	Requirement of the current development install: CPU: Intel® Xeon ® CPU E5-2686 v4 @ 2.30GHz Memory: 4GB

Storage: 32 GB
Bandwidth: 500mb recommended connection speed.


## DigiMarket Setup on AWS EC2 instance 
The following steps will help you install Digimarket on your EC2 instance. This assumes that you already have an EC2 instance running 
and you can RDP into it. 
 
### `Socket.io` setup
1.	Install Node on the EC2 server. Download the latest LTS version from https://nodejs.org/en/download. We used v18.16.0
2.	Download the code from socket.io sample
https://github.com/socketio/socket.io/tree/main/examples/typescript
3.	Launch a command prompt and navigate to the folder
4.	Run the command `npm install` 
5.	Run the command `npm run start:server`
6.	The socket.io server should now ne listening on localhost:3001

### IIS Setup

Application Request Routing (ARR) Setup

1.	Install Application Request Routing v3  Module https://www.microsoft.com/en-us/download/details.aspx?id=47333
2.	Go at Server level in `IIS > ARR` and ensure `Enable proxy` is checked.

![](https://github.com/Digimarket-open-source/Digimarket/blob/main/Enabling_Proxy.png) 

![image](https://user-images.githubusercontent.com/1287634/235748637-1491216e-3a7f-4a1b-ae23-2f17f5810733.png)

Click Server Proxy Settings and then check the Enable proxy checkbox. Keep all other settings as it is.

![image](https://user-images.githubusercontent.com/1287634/235748954-ce2a37fb-586e-452e-9de7-10d724f52fba.png)

### Url Rewrite
1.	Install UrlRewrite module https://www.iis.net/downloads/microsoft/url-rewrite
2.	Setup the Url rewrite rule for reverse proxy at the server level
3.	Select the server node and then double click the Url Rewrite in the right pane

![image](https://user-images.githubusercontent.com/1287634/235749099-f5a69aab-5023-4682-b1e2-87a6afa290c3.png)

4.	Select Add Rule and then Blank Rule

![image](https://user-images.githubusercontent.com/1287634/235749217-9236ef99-05ce-454a-8de8-ed98fcb2406d.png)

5. Fill in the details as follows:

Name: ReverseProxy localhost:4001 (could be any descriptive name)
Pattern: (.*)

![image](https://user-images.githubusercontent.com/1287634/235749562-dbb7ba57-ddaa-40c8-b428-d85fdb57fd6b.png)

Condition: HTTP_HOST 
Condition Pattern: ^{your EC2 public IP}:4001$ as shown below

![image](https://user-images.githubusercontent.com/1287634/235749989-f03f65eb-51d7-4e7d-8972-faf1b5bf6cd1.png)

Rewrite URL:
http://localhost:3001/{R:1}

![image](https://user-images.githubusercontent.com/1287634/235750239-9673ce3d-36c1-4ec8-ba29-5d11509989e3.png)


### MySQL Setup:
1.	Download and install MySQL Community Edition along with MySQL Workbench https://dev.mysql.com/downloads/installer/
2.	MySQL Workbench will assist in restoring the database backup dump
3.	Restore the MySQL database dump which is located at following path at EC2 C:\Users\Administrator\Documents\dumps\Dump20230426\ Dump20230426.sql

### IIS API Setup:

1.	Publish the DigiMarketWebApi project, zip the published folder.
2.	Upload the zip folder on EC2 server and unzip it at `C:\inetpub\wwwroot\Digimarketapi` on the EC2 server
3.	Update the database connection string in appsettings.json file located at C:\inetpub\wwwroot\Digimarketapi. Open the appsettings.json file and then update the `defaultconnection` under `ConnectionStrings`.
4.	Create a new site in IIS named Digimarketapi and set the physical path to `C:\inetpub\wwwroot\Digimarketapi` folder
5.	Set the site bindings as follows:

![image](https://user-images.githubusercontent.com/1287634/235750483-7ae14816-281c-4cea-bef4-35c6553dcb98.png)

6.	Go to Application Pools under IIS Server node, and then open the advanced settings for Digimarketapi app pool

![image](https://user-images.githubusercontent.com/1287634/235750558-c86b698a-09c2-4124-8e24-7c7504f7090a.png)

7.	Set the .NET CLR Version to No Managed Code and set the Enable 32 bit Applications to true

![image](https://user-images.githubusercontent.com/1287634/235750655-51bb9fc4-99db-45fd-86f7-bec52a74c7a0.png)

8.	Ensure API is running by browsing to url http://localhost:81/swagger


### IIS Client App Setup

1.	On development machine, browse to ClientApp folder
Open env.js file and update the API_URL, PORT, and SOCKET settings as per the environment. E.g. we updated these settings as follows:

```js
export default {
  API_URL: "http://3.16.215.131",
  PORT: 81,
  SOCKET: "http://3.16.215.131:4001",
};
``` 	

2.	Run `npm install` command to restore npm packages
3.	Run `npm run build` command to publish the client app.
4.	Once the build command is successful, zip the ClientApp/build folder and upload to EC2
5.	Unzip the folder at location `C:\inetpub\wwwroot\clientApp`
6.	Create a `web.config` file at `C:\inetpub\wwwroot\clientApp` and paste the following code:

```xml
<?xml version="1.0"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                        <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

7.	Create a new IIS site named `DigiMarketClientApp` with physical path set `C:\inetpub\wwwroot\clientApp` 
8.	Set the bindings as follows:

![image](https://user-images.githubusercontent.com/1287634/235751418-8eb921bb-c57d-4529-997e-842a61ff7819.png)

9.	Ensure the client app is running by browsing to the EC2 public IP (Use your EC2 public IP) e.g. http://3.16.215.131/

### Firewall Allow Ports:
Follow these steps to allow ports 81 (for API) and 4001 (for socket) 
1.	Go to Windows Defender Firewall with Advanced Security 
2.	Click Inbound rules and then click New
3.	Select Port
![image](https://user-images.githubusercontent.com/1287634/235758942-c4523b98-7709-4df8-af90-e345beab95d3.png)

4.	Type in the port, then click next

![image](https://user-images.githubusercontent.com/1287634/235759057-77b4c932-38fb-4d70-982e-cea781506d14.png)


5.	Select Allow Connection 

![image](https://user-images.githubusercontent.com/1287634/235759185-15bfd265-9b24-4114-a61c-01ed97fa4882.png)

6. Leave all three checkboxes as checked

![image](https://user-images.githubusercontent.com/1287634/235759297-c3ad585f-1f8f-410f-8b32-1a92c3d9ed9f.png)

7. Specify the rule name and then click ok
8. Ensure both rules are added with green tick mark which indicates connection is allowed on both these ports

![image](https://user-images.githubusercontent.com/1287634/235759402-236fb31a-c0a9-4420-9383-ad80777cdfa7.png)

### Checking success
If everything is successfull, you should be able to see and use the client app by accessing the public IP of your EC2 instance as shown below

![image](https://user-images.githubusercontent.com/1287634/235764532-fd38e547-dd92-4e8d-98c3-3cc47f22c2bf.png)


