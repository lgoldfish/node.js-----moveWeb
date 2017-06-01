var mongoose=require("mongoose")
var Movie=mongoose.model("Movie",{
	name:String,
	doctor:String,
	actor:String,
	country:String,
	language:String,
	intro:String,
	link:String,
	image:String,
	year:String
})
module.exports=Movie