const express = require("express");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require('../controllers/user');
const { decreaseQuantity, list } = require("../controllers/book");
const { create, inventoryCheck, listItems, inventoryById, deleteItem, inventoryHistory } = require("../controllers/inventory");
const router = express.Router();

router.post('/inventory/create/:userId', requireSignin, isAuth, create);
router.get('/inventory/check', inventoryCheck);
router.get('/inventory/items', inventoryHistory)
router.get("/inventory/list/:userId", requireSignin, isAuth, isAdmin, listItems);
router.delete("/inventory/:inventoryId/:userId", requireSignin, isAuth, isAdmin, deleteItem);

router.param('userId', userById);
router.param('inventoryId', inventoryById);
module.exports = router;