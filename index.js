const rp = require('request-promise'); //npm install request-promise
const url = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1';

class Product{
  constructor(name, domestic, price, weight, description){
    this.name = name;
    this.domestic = domestic;
    this.price = price;
    this.weight = weight;
    this.description = description;
  }

  getPrice(){
    return this.price;
  }

  print(){
    console.log(`... `+this.name);
    console.log(`    Price:`, `$`+this.price.toFixed(1));
    console.log(`   `, this.description.substring(0,10)+`...`);

    if (this.weight == null)
      console.log(`    Weight: N/A`);
    else
      console.log(`    Weight:`, this.weight+`g`);
  }
}

rp(url)
  .then(function(html){

    //take data
    const doc = JSON.parse(html);
    let data = doc.sort(function(obj1, obj2){
      return obj2.domestic - obj1.domestic});

    //sort in groups, one domestic, other imported
    let group_domestic = new Array(), group_import = new Array();
    let domestic_cost = 0, imported_cost = 0;

    data.forEach(obj=>{
      let object = new Product(obj.name, obj.domestic, obj.price, obj.weight, obj.description);
      if (obj.domestic){
        domestic_cost += object.getPrice();
        group_domestic.push(object);
      }
      else{
        imported_cost += object.getPrice();
        group_import.push(object);
      }
    });

    //then sort alphabetically
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
    
    //get products amount
    const domestic_count = group_domestic.length;
    const imported_count = group_import.length;

    //print elements and rest from requirement
    console.log(`. Domestic`);
    group_domestic.forEach(element => {
      element.print();
    });

    console.log(`. Imported`);
    group_import.forEach(element => {
      element.print();
    });

    console.log(`Domestic cost:`, `$`+domestic_cost.toFixed(1));
    console.log(`Imported cost:`, `$`+imported_cost.toFixed(1));
    console.log(`Domestic count:`, domestic_count);
    console.log(`Imported count:`, imported_count);

  })
  .catch(function(err){
    console.log(err);
  });