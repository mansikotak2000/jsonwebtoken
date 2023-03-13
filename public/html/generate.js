let data=[];
// let cityList=['keshod','rajkot','surat','junagadh'];
var main=document.getElementById("main");
let clg=['mu','gtu','su','rkc','spu','gec','hngu','gnu','gu','darshan','atmiya'];
for(let i=0;i<=1000;i++){
    let r=Math.floor(Math.random()*1000);
    // let city_r=Math.floor(Math.random()*city.length);
    let phone=Math.floor(Math.random()*8574968574);
    let email=`example${Math.floor(Math.random()*r)}@gamil.com`;
    // let city_value=cityList[city_r];
    let college_id_r=Math.floor(Math.random()*10);
    let fname=`xyz${Math.floor(Math.random()*1000)}`;
    let lname=`xyz${Math.floor(Math.random()*1000)}`;

    let query=`insert into student.std_mst (fname,lname,clg_id,email,phone_number) values('${fname}','${lname}',${college_id_r},'${email}','${phone}');`;

   
    // let value=clg[i];
    // let query=`insert into student.clg_master (clg_id,clg_name) values('${i}','${value}');`;

    data[i]=query;
    let p=document.createElement('p');
    p.innerText=data[i];
    main.appendChild(p);

}