var neo4j = require('neo4j-driver').v1;

    var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "deepanj"), {maxTransactionRetryTime: 30000});
    driver.onCompleted = function() {
      // proceed with using the driver, it was successfully instantiated
      console.log("neo4j driver conneted");
    };
    driver.onError = function(error) {
        console.log('Driver instantiation failed', error);
    };

 module.exports.driver = driver;