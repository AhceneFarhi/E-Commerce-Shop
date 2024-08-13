const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Product = require('../model/Product');


exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger (remove) event when deleting document for {aggregation}
    document.remove()
    
    res.status(204).send();
  });
//------------------------------------------------------------------------------

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    
    // Trigger (save) event when update document (for aggregation)
    document.save();

    res.status(200).json({ data: document });
  });
//------------------------------------------------------------------------------

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });
//------------------------------------------------------------------------------
exports.getOne = (Model,populateOpt) =>
  asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    // Build the query
    let query =  Model.findById(id);
    
    if (populateOpt) {
      query = query.populate(populateOpt)
    }
    // Execute the query
    const document = await query;
    
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
//------------------------------------------------------------------------------

exports.getAll = (Model, modelName = '',populateOpt) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });






