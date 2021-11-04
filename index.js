const rp = require('request-promise'); //npm install request-promise
const url = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1';

rp(url)
  .then(function(html){

    //sort by domestic, check for json parse
    const doc = JSON.parse(html);
    var data = doc.sort(function(obj1, obj2){
      return obj2.domestic - obj1.domestic});

    //sort properly now
    var group_domestic = {};
    var group_import = {};

    //split into two separate objects
    group_domestic = data.filter(function(obj){
      return obj.domestic == true;
    });

    group_import = data.filter(function(obj){
      return obj.domestic == false;
    });

    //sort by alphabet
    group_domestic = group_domestic.sort(function(obj1, obj2){
      let name1 = obj1.name.toUpperCase();
      let name2 = obj2.name.toUpperCase();
      return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
    });

    group_import = group_import.sort(function(obj1, obj2){
      let name1 = obj1.name.toUpperCase();
      let name2 = obj2.name.toUpperCase();
      return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
    });

    const domestic_count = Object.keys(group_domestic).length;
    const imported_count = Object.keys(group_import).length;

    let domestic_cost = 0;
    let imported_cost = 0;

    group_domestic.forEach(obj => {
      domestic_cost += obj.price;
    });

    group_import.forEach(obj => {
      imported_cost += obj.price;  
    });

    //print func for both groups
    function printer(group){

      //check if key has value, if true domestic, else import
      let check = false;
      group.forEach(obj => {
        check = obj.domestic;
      });

      if(check)
        console.log(`.`, `Domestic`);
      else
        console.log(`.`, `Imported`);

      group.forEach(obj => {
        console.log(`...`, obj.name);
        console.log(`    Price:`, `$`+obj.price.toFixed(1));
        console.log(`   `, obj.description.substring(0,10)+`...`);
  
        if (obj.weight == null)
          console.log(`    Weight: N/A`);
        else
          console.log(`    Weight:`, obj.weight+`g`);
      });
    }

    printer(group_domestic);
    printer(group_import);

    console.log(`Domestic cost:`, `$`+domestic_cost.toFixed(1));
    console.log(`Imported cost:`, `$`+imported_cost.toFixed(1));
    console.log(`Domestic count:`, domestic_count);
    console.log(`Imported count:`, imported_count);

  })
  .catch(function(err){
    console.log(err);
  });
