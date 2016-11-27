module.exports = (app, watson) => {
  const i18n  = require('i18next');


  // Create the service wrapper
  var tradeoff_analytics = watson.tradeoff_analytics({
  username: '0d4526b3-c50c-4843-b77b-f57268852d88',
  password: '4DpIHWzIBzOQ',
  version: 'v1'
});

var jsoncandidato = '{'+
  '"subject": "phones",'+
  '"generate_visualization": false,'+
  '"columns": ['+
  '  {'+
  '    "key": "price",'+
  '    "type": "numeric",'+
  '    "goal": "min",'+
  '    "is_objective": true,'+
  '    "full_name": "Price",'+
  '    "range": {'+
  '      "low": 0,'+
  '      "high": 400'+
  '    },'+
  '    "format": "number:2"'+
  '  },'+
  '  {'+
  '    "key": "weight",'+
  '    "type": "numeric",'+
  '    "goal": "min",'+
  '    "is_objective": true,'+
  '    "full_name": "Weight",'+
  '    "format": "number:0"'+
  '  },'+
  '  {'+
  '    "key": "brand",'+
  '    "type": "categorical",'+
  '    "goal": "min",'+
  '    "is_objective": true,'+
  '    "full_name": "Brand",'+
  '    "range": ['+
  '      "Apple",'+
  '      "HTC",'+
  '      "Samsung",'+
  '      "Sony"'+
  '    ],'+
  '    "preference": ['+
  '      "Samsung",'+
  '      "Apple",'+
  '      "HTC"'+
  '    ]'+
  '  },'+
  '  {'+
  '    "key": "rDate",'+
  '    "type": "datetime",'+
  '    "goal": "max",'+
  '    "full_name": "Release Date",'+
  '    "format": "date: \'MMM dd, yyyy\'"'+
  '  }'+
  '],'+
  '"options": ['+
  '  {'+
  '    "key": "1",'+
  '    "name": "Samsung Galaxy S4",'+
  '    "values": {'+
  '      "price": 249,'+
  '      "weight": 130,'+
  '      "brand": "Samsung",'+
  '      "rDate": "2013-04-29T00:00:00Z"'+
  '    }'+
  '  },'+
  '  {'+
  '    "key": "2",'+
  '    "name": "Apple iPhone 5",'+
  '    "values": {'+
  '      "price": 349,'+
  '      "weight": 112,'+
  '      "brand": "Apple",'+
  '      "rDate": "2012-09-21T00:00:00Z"'+
  '    }'+
  '  },'+
  '  {'+
  '    "key": "3",'+
  '    "name": "HTC One",'+
  '    "values": {'+
  '      "price": 299,'+
  '      "weight": 112,'+
  '      "brand": "HTC",'+
  '      "rDate": "2013-03-01T00:00:00Z"'+
  '    }'+
  '  },'+
  '  {'+
  '    "key": "4",'+
  '    "name": "Samsung Galaxy S5",'+
  '    "values": {'+
  '      "price": 349,'+
  '      "weight": 135,'+
  '      "brand": "Samsung",'+
  '      "rDate": "2014-04-29T00:00:00Z"'+
  '    }'+
  '  },'+
  '  {'+
  '    "key": "5",'+
  '    "name": "Apple iPhone 6",'+
  '    "values": {'+
  '      "price": 399,'+
  '      "weight": 118,'+
  '      "brand": "Apple",'+
  '      "rDate": "2013-09-21T00:00:00Z"'+
  '    }'+
  '  },'+
  '  {'+
  '    "key": "6",'+
  '    "name": "Apple iPhone 7",'+
  '    "values": {'+
  '      "price": 499,'+
  '      "weight": 118,'+
  '      "brand": "Apple",'+
  '      "rDate": "2014-09-21T00:00:00Z"'+
  '    }'+
  '  },'+
  '  {'+
  '    "key": "7",'+
  '    "name": "Sony Xperia",'+
  '    "values": {'+
  '      "price": 199,'+
  '      "weight": 120,'+
  '      "brand": "Sony",'+
  '      "rDate": "2014-08-21T00:00:00Z"'+
  '    }'+
  '  }'+
  ']'+
'}';

var params=JSON.parse(jsoncandidato);

  app.get('/testTradeoff', (req, res)=>{
    tradeoff_analytics.dilemmas(params, function(error, resolution) {
      if (error)
        console.log('error:', error)
      else
        console.log(JSON.stringify(resolution, null, 2));
      });
  });



}
