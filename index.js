//definea constant variable that holds keys env
//variables to connect to REDIS
const keys = require ('./keys');
//the application requires redis client
const redis= require ('redis');

//define redis client
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});
//define a duplicate of the redisclient (why?)
const sub= redisClient.duplicate();

function fib(index){
	if(index < 2) return 1;
	return fib(index -1)+fib(index-2);
}

//use the subscription defined of redis client to monitor
//redis for new values and eventually invok the fib function
sub.on('message',(channel,message) => {
	redisClient.hset('values',message,fib(parseInt(message)));	
});
//the subscriber of Redis will subscribe to any insert event
sub.subscribe('insert');