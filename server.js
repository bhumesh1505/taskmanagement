var express 	= require('express');
var app 		= express();
const port 		= 8888 || process.env.PORT;
var morgan 		= require('morgan');
var mongoose 	= require('mongoose');
var bodyParser	= require('body-parser');
var router		= express.Router();
var appRoutes 	= require('./app/routes/api')(router);
var path		= require('path');
var fs 			= require('fs');

const homedir = require('os').homedir();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/taskmanager/public', express.static('public'));
app.use('/taskmanager/api',appRoutes);

app.use('/public', express.static('public'));
app.use('/api',appRoutes);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//const url = 'mongodb://localhost:27017/taskmanagement';
const url = 'mongodb+srv://bhumesh1998:bhumesh1998@cluster0.n3dcusx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(url,function(err){
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
});

/*
// listen (start app with node server.js) ======================================
var server = require('https').createServer({
	key: fs.readFileSync('/etc/apache2/ssl/healthatm.in.key'),
	cert: fs.readFileSync('/etc/apache2/ssl/healthatm.in.certi.crt')
}, app);
server.listen(port ,function() {
	console.log("Running server at port : ",port);
});
*/

app.listen(port ,function() {
	console.log("Running server at port : ",port);
});
