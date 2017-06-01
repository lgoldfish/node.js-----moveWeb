var express = require('express');
var router = express.Router();
var path=require("path")
var fs=require("fs")
var Movie=require(path.join(__dirname,"/../models/Movie"))
var multer=require("multer")
var upload=multer({dest:"public/images/"})
// 后台首页(列表列)
router.get('/', function(req, res, next) {
  Movie.find().sort({_id:-1}).then((data)=>{
  	var movies=data;
  	res.render("./admin/list",{
  	movies
  })
  },(err)=>{
  	res.send("err",err)
  })
});

// 后台录入页
router.get("/upload/",(req,res)=>{
	res.render("./admin/upload",{
		title:"后台录入页"
	})

})
router.post("/upload",upload.single("image"),(req,res)=>{
	console.log(req.file)
	console.log(req.body)
	var extname=path.extname(req.file.originalname)
	var oldPath="public/images/"+req.file.filename;
	var newPath="public/images/"+req.file.filename+extname;
	fs.rename(oldPath,newPath,(err,data)=>{
		if(err){
			res.send("err",err)
		}else{
			req.body.image=req.file.filename+extname;
			Movie.create(req.body).then((data)=>{
				if(data){
					res.send(`<h1>数据上传成功</h1><br><a href="/users/upload/">继续上传</a>`)
				}else{
					res.send("数据上传失败")
				}
			},(err)=>{
				res.send("err",err)
			})
		}
	})
})
//后台列表页
router.get("/list/",(req,res)=>{
	Movie.find().then((data)=>{
		var movies=data;
		res.render("./admin/list",{
			movies
		})
	},(err)=>{
		res.send("error",err)
	})

})

// 删除本影片
router.get("/list/remove/",(req,res)=>{
	console.log(  "22222",req.query)
	Movie.remove({_id:req.query.movieid}).then((data)=>{
		fs.unlink("public/images/"+req.query.imageid);
		res.send(`<h3>删除成功</h3><a href="/users/list">返回影片列表页</a>`)
	},(err)=>{
		res.send("error",err)
	})
})

// 修改页面
router.get("/list/update/:id",(req,res)=>{
	Movie.findById({_id:req.params.id}).then((data)=>{
		var movie=data
		res.render("./admin/update",{
			movie
		})
	},(err)=>{
		res.send("error",err)
	})
})

router.post("/list/update",upload.single("image"),(req,res)=>{
	console.log(req.file)
	console.log(req.body)
	if(req.file){
	var extname=path.extname(req.file.originalname)
	var oldPath="public/images/"+req.file.filename;
	var newPath="public/images/"+req.file.filename+extname;
	fs.rename(oldPath,newPath,(err,data)=>{
		if(err){
			res.send("err",err)
		}else{
			var originalimage=req.body.img;
			req.body.image=req.file.filename+extname;
			Movie.update({_id:req.body._id},{$set:req.body}).then((data)=>{
				if(data){
					fs.unlink("public/images/"+originalimage)
					res.send(`<h1>数据修改成功</h1><br><a href="/users/list/">返回列表页</a>`)
				}else{
					res.send("数据修改失败")
				}
			},(err)=>{
				res.send("err",err)
			})
		}
	})
	}else {
		Movie.update({_id:req.body._id},{$set:req.body}).then((data)=>{
				if(data){
					res.send(`<h1>数据修改成功</h1><br><a href="/users/list/">返回列表页</a>`)
				}else{
					res.send("数据修改失败")
				}
			},(err)=>{
				res.send("err",err)
			})
	}

})


module.exports = router;
