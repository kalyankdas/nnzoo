'use strict';

var cache = require('memory-cache');
var bing = require('./bingSearch');
var kmeans = require('node-kmeans');
var bingSearch = new bing.BingSearch('RsNs+erZKUzDH0e2og7vP7Yj1Jy4FgwGshRojG9riec=');
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');
var _ = require('underscore');
var Converter=require("csvtojson").core.Converter;
var fs=require("fs");
var file = "./data/zoo.csv";

var fileStream=fs.createReadStream(file);
//new converter instance
var csvConverter=new Converter({constructResult:true});
fileStream.pipe(csvConverter);
var animals = [];
csvConverter.on("end_parsed",function(jsonObj){

    animals = jsonObj;


   /* _.each(animals,function(animal){
        bingSearch.search(animal.name,function(data){
            if (data.data)
                animal.mediaurl = data.data[0].MediaUrl;
            //console.log(animal.url);
        });

    });*/



});

var brain = require('brain');


/*
var net = new brain.NeuralNetwork({ hiddenLayers: [14],
    learningRate: 0.01
});
*/

var net = new brain.NeuralNetwork({ hiddenLayers: [14]});
brain.NeuralNetwork.prototype.fromJSON =  function(json) {
    var size = json.layers.length;
    this.outputLayer = size - 1;

    this.sizes = new Array(size);
    this.weights = new Array(size);
    this.biases = new Array(size);
    this.outputs = new Array(size);

    for (var i = 0; i <= this.outputLayer; i++) {
        var layer = json.layers[i];
        if (i == 0 && (!layer[0] || json.inputLookup)) {
            this.inputLookup = lookup.lookupFromHash(layer);
        }
        else if (i == this.outputLayer && (!layer[0] || json.outputLookup)) {
            this.outputLookup = lookup.lookupFromHash(layer);
        }

        var nodes = _(layer).keys();
        this.sizes[i] = nodes.length;
        this.weights[i] = [];
        this.biases[i] = [];
        this.outputs[i] = [];

        for (var j in nodes) {
            var node = nodes[j];
            if (layer[node]) {
                this.biases[i][j] = layer[node].bias;
                this.weights[i][j] = _(layer[node].weights).toArray();
            }
        }
    }
    return this;
};



var trainNetwork = function() {
    var trainArr;

    trainArr = _.map(animals, function(item) {

        var features = [parseInt(item.hair), parseInt(item.feathers), parseInt(item.eggs), parseInt(item.milk), parseInt(item.airborne), parseInt(item.aquatic), parseInt(item.predator), parseInt(item.toothed),
                parseInt(item.backbone), parseInt(item.breathes), parseInt(item.venomous),
                parseInt(item.fins), parseInt(item.tail), parseInt(item.domestic), parseInt(item.catsize)];

        var legs = convertInMultiDimension(8, parseInt(item.legs));

        var input = features.concat(legs);

        return {
            input: input,
            output: convertInMultiDimension(7, parseInt(item.type))

        };


    });

    console.log(trainArr);

    net.train(trainArr, {
        errorThresh: 0.0004,  // error threshold to reach
        iterations: 20000,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 10,        // number of iterations between logging
        learningRate: .3
    });
    var data = JSON.stringify(net.toJSON());

    cache.put("trainJson",data);
    cache.put("trainingData",JSON.stringify(trainArr));

// sample run

    var item = {
        hair: '1',
        feathers: '0',
        eggs: '0',
        milk: '0',
        airborne: '0',
        aquatic: '0',
        predator: '0',
        toothed: '1',
        backbone: '1',
        breathes: '1',
        venomous: '0',
        fins: '0',
        legs:'2',
        tail: '0',
        domestic: '0',
        catsize: '0'
    };

    var features = [parseInt(item.hair), parseInt(item.feathers), parseInt(item.eggs), parseInt(item.milk), parseInt(item.airborne), parseInt(item.aquatic), parseInt(item.predator), parseInt(item.toothed),
        parseInt(item.backbone), parseInt(item.breathes), parseInt(item.venomous),
        parseInt(item.fins), parseInt(item.tail), parseInt(item.domestic), parseInt(item.catsize)];

    var legs = convertInMultiDimension(8, parseInt(item.legs));

    var input = features.concat(legs);

    var output = net.run(input);
    console.log(output);
    //return trainArr;
};


var convertInMultiDimension = function(dimension,number){
    var itemArray = [];
    var i;
    for (i = 1; i<= dimension; i++) {
        if (i == number)
            itemArray.push(1);
        else
            itemArray.push(0);
    }
    return itemArray;
};

Array.prototype.max = function(){
    return Math.max.apply( Math, this );
};


/**
 * Get awesome things
 */
exports.train = function(req, res) {
    trainNetwork();
    return res.json(net.toJSON());
};



exports.animals = function(req, res) {
    return res.json(animals);
};

exports.crossValidateWithTraining = function(req, res) {
    var networkData = JSON.parse(cache.get('trainJson'));

   // bug in brain ....
    if (networkData) {
        net = new brain.NeuralNetwork().fromJSON(networkData);

    }
    else
        trainNetwork();

    var trainingDataMatrix =  JSON.parse(cache.get('trainingData'));
    if (trainingDataMatrix){

       var response =  _.map(trainingDataMatrix, function(data){
            var outputVector = net.run(data.input);
            console.log("outputVector:"+outputVector);
            var networkOutput = outputVector;
            var outputFromNetworkIndex = outputVector.indexOf(Math.max.apply(null, outputVector));
            var success = data.output[outputFromNetworkIndex] === 1;
            return {input:data.input, output: data.output, networkOutput: networkOutput.toString(), match: success}
        });


       return res.json(response);
    }
    return res.json({});

};

exports.evaluate = function(req, res) {
    var item = req.body;
    console.log(req.body);
    var data;
    //bug in brain from Json dont work
   /* data = JSON.parse(cache.get('trainJson'));
    if (!data){
        trainNetwork();
    }*/
   // data = JSON.parse(cache.get('trainJson'));
    //console.log("json");
    //console.log(data);

   // net.fromJSON(data);

    trainNetwork();
    var features = [parseInt(item.hair), parseInt(item.feathers), parseInt(item.eggs), parseInt(item.milk), parseInt(item.airborne), parseInt(item.aquatic), parseInt(item.predator), parseInt(item.toothed),
        parseInt(item.backbone), parseInt(item.breathes), parseInt(item.venomous),
        parseInt(item.fins), parseInt(item.tail), parseInt(item.domestic),parseInt(item.catsize)];


    var legs = convertInMultiDimension(8, parseInt(item.legs));

    var input = features.concat(legs);

    var output = net.run(input);
    var data = JSON.stringify(net.toJSON());


   // console.log("after cache");
    console.log(data);
     return res.json({output:output});
    //console.log(output);
};

exports.kmeans = function(req,res) {
    var data = _.map(animals, function(item) { return [parseInt(item.hair), parseInt(item.feathers), parseInt(item.eggs), parseInt(item.milk), parseInt(item.airborne), parseInt(item.aquatic), parseInt(item.predator), parseInt(item.toothed),
        parseInt(item.backbone), parseInt(item.breathes), parseInt(item.venomous),
        parseInt(item.fins), parseInt(item.tail), parseInt(item.domestic),parseInt(item.catsize)];
    });
    
    kmeans.clusterize(data, {k: 15}, function(err,response) {

        if (err) console.error(err);
        else {
            var animalClusters = [];
            for (var i = 0; i < response.length ; i++){
	            var cluster =response[i];
	            var clusterInd = cluster.clusterInd;
	
	            var animalCluster = [];
	
	            for (var j = 0; j < clusterInd.length; j++){
		            animalCluster.push(animals[clusterInd[j]]);
	            }	
	            animalClusters.push(animalCluster);

            }
            
            
            console.log('%o', res);
            return res.json({"cluster":animalClusters});
        }
    });
};

