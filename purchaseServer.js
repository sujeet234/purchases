let express = require("express");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With,Content-Type,Accept"
  );
  next();
});
//process.env.PORT ||
const port = 2410;
app.listen(port, () => console.log(`Listening on port ${port}`));

let { client } = require("./shopDB.js");
client.connect();

app.get("/shops", function (req, res) {
  let query = `SELECT * FROM shops`;
  client.query(query, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else res.send(results.rows);
  });
});
app.get("/products", function (req, res) {
  let query = `SELECT * FROM products`;
  client.query(query, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else res.send(results.rows);
  });
});
app.get("/purchases", function (req, res) {
  let shop = req.query.shop;
  let product = req.query.product;
  let sort  = req.query.sort;
  let query = `SELECT * FROM purchases`;
  client.query(query, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else {
            let arr = [];
            let datam=results.rows;
            if(product){
                let catgArr = product.split(",");
                catgArr.forEach((elem)=>{
                    let temp=datam.filter((fl)=>"pr"+fl.productid==elem);
                    arr.push(...temp);
                })
                datam=arr;
            }
            if(shop){
                
                let catgArr = shop.split("st"+",");
                datam = datam.filter((st)=>catgArr.find((c1)=>c1 == "st"+st.shopid));
            }
            datam = sort==="QtyAsc" ? datam.sort((st1,st2)=>st1.quantity-st2.quantity):datam;
            datam = sort==="QtyDesc" ? datam.sort((st1,st2)=>st2.quantity-st1.quantity):datam;
            datam = sort==="ValueAsc" ? datam.sort((st1,st2)=>st1.quantity*st1.price-st2.quantity*st2.price):datam;
            datam = sort==="ValueDesc" ? datam.sort((st1,st2)=>st2.quantity*st2.price-st1.quantity*st1.price):datam;
            // console.log(datam);
            res.send(datam);
        
    }

  });
  
  
  // console.log(data);
  
});

app.get("/products/:id", function (req, res) {
  let id = +req.params.id;
  let query = `SELECT * FROM products WHERE productid=${id}`;
  console.log(query);
  client.query(query,  function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else res.send(results.rows);
    // client.end();
  });
});
app.get("/purchases/shops/:id", function (req, res) {
  let id = +req.params.id;
  let query = `SELECT * FROM purchases WHERE purchases.shopid=${id}`;
  // console.log(query);
  client.query(query, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else res.send(results.rows);
    // client.end();
  });
});
app.get("/purchases/products/:id", function (req, res) {
  let id = +req.params.id;
  let query = `SELECT * FROM purchases WHERE productid=${id}`;
  // console.log(query);
  client.query(query, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else res.send(results.rows);
    // client.end();
  });
});

app.get("/totalPurchases/shops/:id",function(req,res){
  let id = +req.params.id;
  let query = `SELECT * FROM purchases WHERE shopid=${id}`;
  client.query(query, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else {
      let json = [];
      results.rows.forEach((ele)=>{
        let jsonData=json.find((elem)=>elem.productId==ele.productid);
        // console.log(jsonData);
        if(jsonData){
            jsonData.totalPurchases+=(ele.quantity*ele.price);
        }else{
            let temp={shopId:ele.shopid,productId:ele.productid,totalPurchases:ele.quantity*ele.price};
            json.push(temp);
        }
      })
      if(json) res.send(json);
      else res.send("Error in show data");
    }
    // client.end();
  });
})
app.get("/totalPurchases/products/:id",function(req,res){
  let id = +req.params.id;
  let query = `SELECT * FROM purchases WHERE productid=${id}`;
  client.query(query, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in fetching data");
    } else {
      let json = [];
      results.rows.forEach((ele)=>{
        let jsonData=json.find((elem)=>elem.shopId==ele.shopid);
        // console.log(jsonData);
        if(jsonData){
            jsonData.totalPurchases+=(ele.quantity*ele.price);
        }else{
            let temp={shopId:ele.shopid,productId:ele.productid,totalPurchases:ele.quantity*ele.price};
            json.push(temp);
        }
      })
      if(json) res.send(json);
      else res.send("Error in show data");
    }
    // client.end();
  });
})

app.post("/products", function (req, res) {
  let body = req.body;
  let query = `INSERT INTO products(productname,category,description) VALUES($1,$2,$3)`;
  client.query(
    query,
    [body.productname, body.category, body.description],
    function (err, results) {
      if (err) {
        console.log(err);
        res.status(404).send("Error in inserting data");
      } else res.send(results);
    }
  );
});
app.post("/shops", function (req, res) {
  let body = req.body;
  let query = `INSERT INTO products(shopid,shopname,rent) VALUES($1,$2,$3)`;
  client.query(query,[body.shopid, body.shopname, body.rent],function (err, results) {
      if (err) {
        console.log(err);
        res.status(404).send("Error in inserting data");
      } else res.send(results);
    }
  );
});

app.put("/products/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  let query = `UPDATE products SET productname=$1,category=$2,description=$3 WHERE productid=$4`;
  let params = [body.productname, body.category, body.description, id];
  client.query(query, params, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send("Error in updation data");
    } else res.send(results.rows);
  });
});


