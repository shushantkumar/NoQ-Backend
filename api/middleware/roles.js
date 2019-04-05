var guest={ };
var doc={ };
var receptionist= { };
var student1= { };
var student2= { };
var student3= { };
var student4= { };

guest["/users/login/"]=true;
guest["/doctors/login/"]=true;
guest["/reception/login/"]=true;

doc["/doctors/"]=true;
doc["/doctors/login/"]=true;
doc["/visits/"]=true;
doc["/visits/s/"]=true;
doc["/pendings/"]=true;
doc["/pendings/0/"]=true;

receptionist["/reception/"]=true;
receptionist["/pendings/0/"]=true;
receptionist["/pendings/"]=true;

student1["/users/"]=true;
student1["/pendings/s/"]=true;
student1["/visits/s/"]=true;

student2= student1;
student2["/court/"]=true;
student2["/event/sp/"]=true;

student3=student2;
student3["/event/sac/"]=true;

student4=student3;
student4["/event/sja/"]=true;


var roles= { };

roles[444]=guest;
roles[0]=doc;
roles[1]=receptionist;
roles[2]=student1;
roles[3]= student2;
roles[4]=student3;
roles[5]=student4;

module.exports = roles;
