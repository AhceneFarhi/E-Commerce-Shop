




const  mountRoutes = (app)=>
{

app.use('/api/v1/categories',require("./categoryRoute") )
app.use('/api/v1/subcategories',require("./subCategoryRoute") )
app.use('/api/v1/brands',require("./brandRoute") )
app.use('/api/v1/products',require("./productRoute") )
app.use('/api/v1/users',require("./userRoute") )
app.use('/api/v1/auth',require("./authRouter") )
app.use('/api/v1/reviews',require("./reviewRouter") )
app.use('/api/v1/wishlist',require("./wishListRoute") )
app.use('/api/v1/adresses',require("./adressesRouter") )
app.use('/api/v1/coupons',require("./couponRouter") )
app.use('/api/v1/cart',require("./cartRouter") )
app.use('/api/v1/orders',require("./orderRouter") )

}


module.exports = mountRoutes