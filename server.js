import  express  from 'express'
import { productsManager } from './app.js'

// ACTIVAMOS EL MODULO PARA LEVANTAR EL SV
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// TRAER TODOS LOS PRODUCTOS
app.get('/products',async(req,res)=>{
    try {
        const products = await productsManager.getProducts()
        if(!products.length){
            res.status(200).json({message:'No users found'})
        }else{
            res.status(200).json({message:'Users found', products})
        }


    } catch (error) {
        res.status(500).json({message: error})
    }
})

// TRAER PRODUCTOS POR ID QUE VIENE EN LOS PARAMS
app.get('/products/:idProduct',async(req,res)=>{
    const {idProduct} = req.params
    try {
        const product = await productsManager.getProductById(+idProduct)
        if(!product){
            res.status(400).json({message: 'Product not found with the id sent'})
        }else{
            res.status(200).json({message: 'Product found',product})
        }
    } catch (error) {
        res.status(500).json({message: error})
    }
})

// CREAR PRODUCTOS

/*
 --------- DATOS NECESARIOS PARA EL BODY ---------
    "name": 'sprite',
    "description": 'bevida',
    "price": 600,
    "stock": 100
*/
app.post('/products',async(req,res)=>{
    // validamos que nos envien los datos necesarios
    const{name,description,price,stock} = req.body
    if(!name|| !description || !price || !stock){
        return res.status(400).json({message:'Some data is missing'})
    }
    try {
        const newProduct = await productsManager.createProduct(req.body)
        res.status(200).json({message: 'Product created',product:newProduct})
    } catch (error) {
        res.status(500).json({message: error})
    }
})



// iniciamos en escucha el servidor
app.listen(8080,()=>{
    console.log("escuchando al puerto 8080");
})