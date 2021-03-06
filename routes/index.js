var express = require('express');
var router  = express.Router();
var aws     = require('aws-lib');
var fs = require('fs');
if (fs.existsSync('.env')) {
  require('dotenv').load();
}

/* GET home page. */
router.get('/:asin', function(req, res, next) {

  // ASIN
  var asin = req.param('asin');

  prodAdv = aws.createProdAdvClient(process.env.ACCESS_KEY, process.env.SECRET_KEY, process.env.ASSOC_TAG, { region: 'UK' });

  prodAdv.call('ItemLookup', { ResponseGroup: 'RelatedItems,Small', IdType: 'ASIN', ItemId: asin, RelationshipType: 'Tracks'}, function(err, result) {
    if (result.Items.Item) {
      if (result.Items.Item.RelatedItems) {
        key = Math.floor(Math.random() * result.Items.Item.RelatedItems.RelatedItem.length) + 1;
        product = result.Items.Item.RelatedItems.RelatedItem[key];
        prodAdv.call('ItemLookup', { ResponseGroup: 'OfferSummary,Large', IdType: 'ASIN', ItemId: product.Item.ASIN, RelationshipType: 'Tracks'}, function(err, result) {
          res.json({
            id: result.Items.Item.ASIN,
            image: result.Items.Item.LargeImage.URL,
            price: 10.00
          });
        });
      } else {
        res.json({related: 0});
      }
    } else {
      res.json({related: 0});
    }
  })
});

module.exports = router;
