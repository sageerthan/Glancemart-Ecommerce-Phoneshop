const productModel = require("../Models/productModel");
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures');
exports.getProducts = async (req, res, next) => {
    /*const query=req.query.keyword?{name:{
        $regex:req.query.keyword,
        $options:'i'
    }}:{}*/
    // const products = await productModel.find(query);
    const resPerPage = 4;

    const apiFeatures = new APIFeatures(productModel.find(), req.query).search().filter().paginate(resPerPage);

    let buildQuery = () => {
        return new APIFeatures(productModel.find(), req.query).search().filter();
    }
    const products = await apiFeatures.query;

    const filteredProductsCount = await buildQuery().query.countDocuments({});
    const totalProductsCount = await productModel.countDocuments({})
    let productsCount = totalProductsCount;

    if (filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }
    res.status(200).json({
        success: true,
        count: productsCount,
        resPerPage,
        products
    })
}


exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id).populate('reviews.user', 'name email');
        res.status(201).json({
            success: true,
            product
        })
    }
    catch {
        return next(new ErrorHandler('Product not found', 400));
    }
});


//Create Review -api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body;
    const review = {
        user: req.user.id,
        rating,
        comment
    }
    const product = await productModel.findById(productId);
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }

        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, review) => (
        acc + Number(review.rating)
    ), 0) / product.numOfReviews;
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })
})
//Admin functionality
//Admin-Get Reviews 
exports.getReviews = catchAsyncError(async (req, res, next) => {
    const product = await productModel.findById(req.query.id).populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
//Admin-Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await productModel.findById(req.query.productId);
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    })
    product.numOfReviews = reviews.length;
    product.ratings = reviews.reduce((acc, review) => (
        acc + Number(review.rating)
    ), 0) / product.numOfReviews;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;
    await product.save({ validateBeforeSave: false });
    await productModel.findByIdAndUpdate(req.query.productId, {
        reviews
    })

    res.status(200).json({
        success: true,
        message: "Successfully Deleted"
    })
})



//Get Products-api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res) => {
    const products = await productModel.find({});
    res.status(200).json({
        success: true,
        products
    })
})

//Create Product-api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    let images = []

    if (req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }
    req.body.images = images;
    req.body.user = req.user.id;
    const productItem = req.body;
    const product = await productModel.create(productItem);

    res.status(201).json({
        success: true,
        product
    })
})


//Admin update product -api/v1/admin/product/:id

exports.updateProduct = async (req, res, next) => {
       let product = await productModel.findById(req.params.id);

    try {
        let images = []
        //if already exist images not cleared 
        if(req.body.imagesCleared === 'false'){
            images=product.images
        }
        
        if (req.files.length > 0) {
            req.files.forEach(file => {
                let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
                images.push({ image: url })
            })
        }
        req.body.images = images;

        product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            success: true,
            product
        })
    }
    catch {
        return next(new ErrorHandler('Product not found', 400));
    }
}
exports.deleteProduct = async (req, res, next) => {
    try {

        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted"
        })
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Product not found",
            error: error.message
        });
    }
}

