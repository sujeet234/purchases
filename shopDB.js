const {Client} = require("pg");
const client = new Client({
    host:"db.haxhmckjkhmoyybhgmlw.supabase.co",
    user:"postgres",
    port:5432,
    password:"Sujeet@7412",
    database:"postgres",
    ssl: { rejectUnauthorized: false },
}) 
// client.connect();

module.exports.client=client;
// function resetData(){
//         let {data} = require("./shop.js");
//         let arr = data.purchases.map(p=>[p.shopId,p.productid,p.quantity,p.price]);
//         let sql2 = `INSERT INTO purchases(shopid,productid,quantity,price) VALUES($1,$2,$3,$4)`;
//         // console.log(arr);
//         arr.forEach((ele)=>{
//             client.query(sql2,ele,function(err,res){
//                 if(err) console.log(err);
//                 else console.log("Successfully inserted.Affected rows : ",res.rows);
//             });
//         })
        
// }

// resetData();
