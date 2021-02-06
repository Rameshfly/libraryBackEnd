const express = require("express");
const router = express.Router();

const { create, bookById, read, remove, update, list, listRelated, listCategory, listBySearch, photo, listSearch, listSearchByAuthor, listSearchByPublisher } = require("../controllers/book");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");


router.get('/book/:bookId', read);
router.post("/book/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete("/book/:bookId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/book/:bookId/:userId", requireSignin, isAuth, isAdmin, update);
router.get('/books', list);
router.get("/books/search", listSearch);
router.get("/books/searchByAuthor", listSearchByAuthor);
router.get("/books/searchByPublisher", listSearchByPublisher);
router.get("/books/related/:bookId", listRelated);
router.get("/books/categories", listCategory);
router.post("/books/by/search", listBySearch);
router.get("/book/photo/:bookId", photo);

router.param("userId", userById);
router.param("bookId", bookById);

module.exports = router;
