module.exports = (app, watson) => {
  const i18n  = require('i18next');


  // Create the service wrapper
  var tradeoff_analytics = watson.tradeoff_analytics({
  username: '0d4526b3-c50c-4843-b77b-f57268852d88',
  password: '4DpIHWzIBzOQ',
  version: 'v1'
});

var jsoncandidato = {
  "problem": {
    "columns": [
      {
        "type": "numeric",
        "key": "price",
        "full_name": "Price",
        "range": {
          "low": 0,
          "high": 400
        },
        "format": "number:2",
        "goal": "min",
        "is_objective": true
      },
      {
        "type": "numeric",
        "key": "weight",
        "full_name": "Weight",
        "format": "number:0",
        "goal": "min",
        "is_objective": true
      },
      {
        "type": "categorical",
        "key": "brand",
        "full_name": "Brand",
        "range": [
          "Apple",
          "HTC",
          "Samsung",
          "Sony"
        ],
        "goal": "min",
        "preference": [
          "Samsung",
          "Apple",
          "HTC"
        ],
        "is_objective": true
      },
      {
        "type": "datetime",
        "key": "rDate",
        "full_name": "Release Date",
        "format": "date: 'MMM dd, yyyy'",
        "goal": "max",
        "is_objective": false
      }
    ],
    "subject": "phones",
    "options": [
      {
        "key": "1",
        "name": "Samsung Galaxy S4",
        "values": {
          "price": 249,
          "weight": 130,
          "brand": "Samsung",
          "rDate": "2013-04-29T00:00:00Z"
        }
      },
      {
        "key": "2",
        "name": "Apple iPhone 5",
        "values": {
          "price": 349,
          "weight": 112,
          "brand": "Apple",
          "rDate": "2012-09-21T00:00:00Z"
        }
      },
      {
        "key": "3",
        "name": "HTC One",
        "values": {
          "price": 299,
          "weight": 112,
          "brand": "HTC",
          "rDate": "2013-03-01T00:00:00Z"
        }
      },
      {
        "key": "4",
        "name": "Samsung Galaxy S5",
        "values": {
          "price": 349,
          "weight": 135,
          "brand": "Samsung",
          "rDate": "2014-04-29T00:00:00Z"
        }
      },
      {
        "key": "5",
        "name": "Apple iPhone 6",
        "values": {
          "price": 399,
          "weight": 118,
          "brand": "Apple",
          "rDate": "2013-09-21T00:00:00Z"
        }
      },
      {
        "key": "6",
        "name": "Apple iPhone 7",
        "values": {
          "price": 499,
          "weight": 118,
          "brand": "Apple",
          "rDate": "2014-09-21T00:00:00Z"
        }
      },
      {
        "key": "7",
        "name": "Sony Xperia",
        "values": {
          "price": 199,
          "weight": 120,
          "brand": "Sony",
          "rDate": "2014-08-21T00:00:00Z"
        }
      }
    ]
  },
  "resolution": {
    "solutions": [
      {
        "solution_ref": "1",
        "status": "FRONT"
      },
      {
        "solution_ref": "2",
        "status": "FRONT"
      },
      {
        "solution_ref": "3",
        "status": "FRONT"
      },
      {
        "solution_ref": "4",
        "status": "EXCLUDED"
      },
      {
        "solution_ref": "5",
        "status": "EXCLUDED"
      },
      {
        "solution_ref": "6",
        "status": "INCOMPLETE",
        "status_cause": {
          "message": "A column of a option is out of range. Option \"6\" has a value in column \"price\" which is:\"499\" while the column range \"is: [0.0,400.0]\"",
          "error_code": "RANGE_MISMATCH",
          "tokens": [
            "price",
            "499",
            "[0.0,400.0]"
          ]
        }
      },
      {
        "solution_ref": "7",
        "status": "DOES_NOT_MEET_PREFERENCE",
        "status_cause": {
          "message": "Option \"7\" has a value that does not meet preference for column \"brand\"",
          "error_code": "DOES_NOT_MEET_PREFERENCE",
          "tokens": [
            "brand"
          ]
        }
      }
    ]
  }
};

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
