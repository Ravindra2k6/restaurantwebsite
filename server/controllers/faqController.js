const FAQ = require("../models/FAQ");
const { getAll, getOne, createOne, updateOne, deleteOne } = require("../utils/handlerFactory");

const getAllFAQs = getAll(FAQ, {
  searchableFields: ["question", "answer"],
  defaultSort: "displayOrder",
});
const getFAQById = getOne(FAQ);
const createFAQ = createOne(FAQ);
const updateFAQ = updateOne(FAQ);
const deleteFAQ = deleteOne(FAQ);

module.exports = { getAllFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ };
