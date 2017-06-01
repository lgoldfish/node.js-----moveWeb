var express = require('express');
var router = express.Router();
var path=require("path")
var Movie=require(path.join(__dirname,"/../models/Movie"))

/* GET home page. */
router.get('/', function(req, res, next) {
   Movie.find().sort({_id:-1}).then((data)=>{
  	var movies=data;
  	res.render("index",{
  	movies
  })
  },(err)=>{
  	res.send("err",err)
  })
});
router.get("/movie/:id",function(req,res){
	console.log("8888",req.params.id)
	Movie.findById(req.params.id).then((data)=>{
		var movie=data;
		res.render("detail",{
		movie
	})
	})
})
module.exports = router;
