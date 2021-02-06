const fromidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Book = require("../models/book");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.bookById = (req, res, next, id) => {
    Book.findById(id)
    .populate("category")
    .exec((err, book) => {
        if(err || !book){
            return res.status(400).json({
                error: "Book not found"
            });
        }
        req.book = book;
        next();
    })
}

exports.read = (req, res) => {
    req.book.photo = undefined;
    return res.json(req.book);
}

exports.create = (req, res) => {
    let form = new fromidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        //check for all fields
        const { bookName, description, category, author, publisher } = fields;

        if(!bookName || !description || !category ||!author ||!publisher){
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let book = new Book(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                })
            }
            book.photo.data = fs.readFileSync(files.photo.path)
            book.photo.contentType = files.photo.type  
        }


        book.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}

exports.remove = (req, res) => {
    let book = req.book;
    book.remove((err, deletedBook) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Book deleted Successfully"
        });
    })
}

exports.update = (req, res) => {
    let form = new fromidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
       if(err){
           return res.status(400).json({
               error: "Image could not be uploaded"
           })
       }
 
       //check for all fields
    //    const { name, description, price, category, quantity ,shipping } = fields;
    //    if(!name || !description || !price || !category || !quantity || !shipping){
    //        return res.status(400).json({
    //            error: "All fields are required"
    //        });
    //    }
 
       let book = req.book;
       book = _.extend(book, fields);
 
       // 1 kb = 1000
       // 1 mb = 1000000
      
       if(files.photo){ 
         // console.log("FILES PHOTO: ", files.photo)
         if(files.photo.size > 1000000){
             return res.status(400).json({
                 error: "Image should be less than 1mb in size"
             })
         }
         book.photo.data = fs.readFileSync(files.photo.path)
         book.photo.contentType = files.photo.type
       }
 
       book.save((err, result) => {
           if(err){
               return res.status(400).json({
                   error: errorHandler(err)
               })
           }
           res.json(result);
       })
 
    })
}




exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Book.find()
       .select("-photo")
       .populate('category')
       .sort([[sortBy, order]])
       .limit(limit)
       .exec((err, books) => {
           if(err){
               return res.status(400).json({
                   error: "Books not found"
               });
           }
           res.json(books);
       })
}


exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
 
    Book.find({ _id: {$ne: req.book}, category: req.book.category})
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, books) => {
      if(err){
          return res.status(400).json({
              error: "Book not found"
          });
      }
      res.json(books);
    })
}




exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if(req.query.search){
        query.bookName = {$regex: req.query.search, $options: 'i'}
        // assign category value to query.category
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Book.find(query, (err, books) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(books);
        }).select('-photo') 
    }
};

exports.listSearchByAuthor = (req, res) => {

    const query = {};

    if(req.query.search){
        query.author = {$regex: req.query.search, $options: 'i'}
        Book.find(query, (err, books) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(books);
        }).select('-photo') 
    }
};


exports.listSearchByPublisher = (req, res) => {
    
    const query = {};
    
    if(req.query.search){
        query.publisher = {$regex: req.query.search, $options: 'i'}
        Book.find(query, (err, books) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(books);
        }).select('-photo') 
    }
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Book.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo = (req, res, next) => {
    if(req.book.photo.data){
        res.set('Content-TYpe', req.book.photo.contentType);
        return res.send(req.book.photo.data);
    }
    next();
}

exports.listCategory = (req, res) => {
     Book.distinct("category", {}, (err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "Categories not found",
            });
        }
        res.json(categories);
     })
}