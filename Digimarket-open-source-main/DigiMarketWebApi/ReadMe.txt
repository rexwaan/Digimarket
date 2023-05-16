Select DbRepository Project in the console and run the below command with your connection string
********** local ***********
Scaffold-DbContext "server=localhostport=3306;user=root;password=;database=digimarket_dev"  Pomelo.EntityFrameworkCore.MySql -OutputDir Models -context digimarket_devContext -Force 

********** Live db ***********
Scaffold-DbContext "server=digimarketdb.cfzesomwscuj.eu-central-1.rds.amazonaws.com;port=3306;user=admin;password=qhZX3h070Z;database=digimarket_sprint_4"  Pomelo.EntityFrameworkCore.MySql -OutputDir Models -context digimarket_devContext -Force 

********** Mission control***********
Scaffold-DbContext "server=db.urbanblue.ch;user id=testAdmin;password=bottle321#;database=missioncontrol_staging_v2" Pomelo.EntityFrameworkCore.MySql -OutputDir Models -context DbContext -Force