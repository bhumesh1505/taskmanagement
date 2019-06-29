var express 	= require('express');
var app 		= express();
const port 		= 8000 || process.env.PORT;
var morgan 		= require('morgan');
var mongoose 	= require('mongoose');
var bodyParser	= require('body-parser');
var router		= express.Router();
var appRoutes 	= require('./app/routes/api')(router);
var path		= require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://bhumesh1998:bhumesh1998@cluster0-ubi02.mongodb.net/taskmanagement?retryWrites=true&w=majority',function(err){
	if(err){
		console.log("failed to connect to database: " + err);
	}
	else
	{
		console.log("Successfully connected to MongoDB");
	}
});


app.get('*', function (req,res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
})
app.listen(port ,function() {
	console.log("Running server at port : ",port);
}); 