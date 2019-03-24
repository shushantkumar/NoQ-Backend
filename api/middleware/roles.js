var guest={ };
var doc={ };
var student= { };
var receptionist= { };

guest["/users/login/"]=true;
guest["/doctors/login/"]=true;
guest["/reception/login/"]=true;

doc["/doctors/"]=true;
doc["/doctors/login/"]=true;

student["/court/"]=true;
student["/event/sac/"]=true;
student["/event/sja/"]=true;

var roles= { };

roles["guest"]=guest;
roles["doctor"]=doc;
roles["student"]=student;
roles["receptionist"]=receptionist;
module.exports = roles;