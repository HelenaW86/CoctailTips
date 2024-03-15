import express from 'express';
import axios from 'axios';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const drink = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php")
         let ingredients = []
         let i = 1
         while (i < 16) {
            let ing = "strIngredient" + i;
            let amount =  "strMeasure" + i
            if(drink.data.drinks[0][ing] !== null){
                ingredients.push(` ${drink.data.drinks[0][ing]}${drink.data.drinks[0][amount] !== null ? ":  " + drink.data.drinks[0][amount]: ""}`)
            }
            i++;
            }
        res.render("index.ejs", {drink: drink.data.drinks[0].strDrink, intro: drink.data.drinks[0].strInstructions, image: drink.data.drinks[0].strDrinkThumb, category: drink.data.drinks[0].strCategory, ingredients: ingredients })
    } catch (error) {
        console.log(error.response.data)
    }
});
app.post("/ingredients", async (req, res) => {
    const value = req.body.value;
    try {
        const drinks = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=` + value) 
        res.render("index.ejs", {array: drinks.data.drinks})
    } catch (error) {
        console.log(error.response.data)
    }
});
app.post("/select", async (req, res) => {
    const v = req.body.selected
    try {
        const drink = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=` + v) 
        let ingredients = []
        let i = 1
        while (i < 16) {
           let ing = "strIngredient" + i;
           let amount =  "strMeasure" + i
           if(drink.data.drinks[0][ing] !== null){
               ingredients.push(` ${drink.data.drinks[0][ing]}${drink.data.drinks[0][amount] !== null ? ":  " + drink.data.drinks[0][amount]: ""}`)
           }
           i++;
           }
        res.render("index.ejs", {drink: drink.data.drinks[0].strDrink, intro: drink.data.drinks[0].strInstructions, image: drink.data.drinks[0].strDrinkThumb, category: drink.data.drinks[0].strCategory, ingredients: ingredients })
    } catch (error) {
        console.log(error.response)
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});