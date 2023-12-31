import fs from 'fs'

class ProductManager{
    constructor(path){
        this.path = path
    }

    // obtener los productos del archivo si es que existen 
    async getProducts(queryObj){

        const {limit} = queryObj        
        try {
            if(fs.existsSync(this.path)){
                const info = await fs.promises.readFile(this.path,'utf-8')
                const infoParsed = JSON.parse(info)

                const limitNumber = +limit
                if(isNaN(limitNumber) || limitNumber <=0){                    
                    return infoParsed
                }else{                    
                    return infoParsed.slice(0, limitNumber)
                }
            }else{
                return []
            }
        } catch (error) {
            return(error)
        }
    }

    // crear los productos recibiendo un objeto
    async createProduct(obj){
        try {
            // traemos todo el arreglo con los productos
            const products = await this.getProducts({})
            // generamos el id auto incrementable
            let id
            if(!products.length){
                id = 1
            }else{
                id = products[products.length-1].id+1
            }
            const newProduct = {id,...obj}
            products.push(newProduct)
            // escribimos el archivo con los datos
            await fs.promises.writeFile(this.path,JSON.stringify(products))
            return newProduct
        } catch (error) {
            return error
        }
    }

    // traer un prodcuto por ID
    async getProductById(idProduct){
        try {
            // traemos todo el arreglo con los productos
            const products = await this.getProducts({})
            const productoBuscado = products.find(p=>p.id === idProduct)
            return productoBuscado
        } catch (error) {
            return error
        }
    }
}

export const productsManager = new ProductManager('Products.json')