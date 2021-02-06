const { errorHandler } = require("../helpers/dbErrorHandler");
const  Inventory  = require("../models/inventory");

exports.inventoryById = (req, res, next, id) => {
   Inventory.findById(id)
   .populate('books.book', 'bookName')
   .exec((err, inventory) => {
       if(err || !inventory){
           return res.status(400).json({
               error: errorHandler(err)
           });
       }
       req.inventory = inventory;
       next();
   })
}

exports.inventoryCheck = (req, res) => {

        let bookId = req.query.bookId;
        const id = {
            bookId : bookId
        }
        console.log(bookId);
        
      Inventory.find(id,(error, data) => {
        if(error){
            return res.status(400).json({
                error: "Books Not found"
            });
            // console.log(error);
        }
        else{
            return res.json(data);
            // console.log(data);
        }
    }
    )
}

exports.inventoryHistory = (req, res) => {

    let userId = req.query.userId;
    const id = {
        userId : userId
    }
    console.log(id);
    
  Inventory.find(id,(error, data) => {
    if(error){

        return res.status(400).json({
            error: "Books Not found"
        });
        // console.log(error);
    }

    else{
        return res.json(data);
        // console.log(data);
    }
}
)

}

exports.create = (req, res) => {
    req.body.user = req.profile;
    const inventory = new Inventory(req.body);
    // console.log({
    //     name: inventory.name,
    //     bookId: inventory.bookId
    // });
    inventory.save((error, data) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.listInventory = (req, res) => {
    Inventory.find()
    .populate('user', "_id name")
    .sort('-created')
    .exec((err, items) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(items);
    })
}

exports.getStatusValues = (req, res) => {
    res.json(Inventory.schema.path("status").enumValues);
}

exports.updateInventoryStatus = (req, res) => {
    Inventory.update(
        { _id: req.body.inventoryId }, 
        {$set: {status: req.body.status}},
        (err, item) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(item);
        }
        )
}

exports.listItems = (req, res) => {
    Inventory.find()
    .populate('user', "_id name")
    .sort('-created')
    .exec((err, items) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(items);
    })
}

exports.deleteItem = (req, res) => {
    let inventory = req.inventory;
    inventory.remove((err, deletedItem) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Item deleted Successfully"
        });
    })
}




