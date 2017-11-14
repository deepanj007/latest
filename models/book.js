const neo4j = require('neo4j-driver').v1;
const database = require('../config/database');
const route = require('./routes');

const session = database.driver.session();
    
const matchRide = function(bookDetails, callback){
    //book the ride and send the feedback
    /**
     * check the route from bookDetails
     * get the middle stopages
     * find pickup will be nearer to which stopage
     * find drop will be nearer to which stopage
     * find stogages in d middle of pickup and drop-
     * create route map{
     *          pickup - truck
     *          affective stopage - truck(1...._....n)
     *          drop - truck
     * }
     */
    return session.run('MATCH (t:Truck {size:"L1"}) return t').then(result => {
        if(result.records.length > 0){
           // result.records.forEach(function(record) {
                    console.log("if block:"+result.records[0]._fields[0].properties.name);
                    session.run("create (p:Stopage {name:'"+bookDetails.pickup.name+"'}),(d:Stopage {name:'"+bookDetails.dest.name+"'}) with p,d match(t:Truck {name:'"+bookDetails.truckNo+"',size:'L1'}) merge (p)-[r:connects{GT:'"+bookDetails.dest.name+"'}]->(t)<-[r1:connects{CF:'"+bookDetails.pickup.name+"'}]-(d) set t.size='L2'")
                    .then(function(result){
                        callback('success');
                        session.close();
                    })
                    .catch(function(error){
                        callback('failure');
                        console.log(error);
                    });
                //}
            //});
            //session.close();
        } else {
            console.log('else');
            session.run("create (p:Stopage {name:'"+bookDetails.pickup.name+"'}),(d:Stopage {name:'"+bookDetails.dest.name+"'}),(t:Truck {name:'"+bookDetails.truckNo+"',size:'"+bookDetails.size+"'}) merge (p)-[r:connects{GT:'"+bookDetails.dest.name+"'}]->(t)<-[r1:connects{CF:'"+bookDetails.pickup.name+"'}]-(d)")
            .then(function(result){
                callback('success');
                session.close();
            })
            .catch(function(error){
                callback('failure');
                console.log(error);
            });
        }
        })
        .catch(function(error){
            console.log(error);
        });   

    let getTruck = function(){
        console.log("in get");
        setTimeout(()=>{
            return true;
        }, 2500);
    }
            
    if(getTruck()){
        console.log("book that truck");
    } else {
        console.log("book new truck");
        /*session.run("create (p:Stopage {name:'"+bookDetails.pickup.name+"'}),(d:Stopage {name:'"+bookDetails.dest.name+"'}),(t:Truck {name:'"+bookDetails.truckNo+"'}) merge (p)-[r:connects{GT:'"+bookDetails.dest.name+"'}]->(t)<-[r1:connects{CF:'"+bookDetails.pickup.name+"'}]-(d)")
        .then(function(result){
            callback('success');
            session.close();
        })
        .catch(function(error){
            callback('failure');
            console.log(error);
        });*/
    }
    //console.log(bookDetails.pickup.name);
    //callback('Success');

};
module.exports.matchRide = matchRide;