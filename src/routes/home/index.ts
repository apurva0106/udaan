import { Router } from "express";
import Query from "../../model/query";

const homeRoutes = Router();

homeRoutes.get('/', async (req, res) => {
    return res.render('home');
});


homeRoutes.get('/about', async (req, res) => {
    return res.render('home/about')
})

homeRoutes.post('/submitQuery', async (req, res) => {
    try {
        let newQuery = await Query.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });

        console.log('new query is ', newQuery);
        return res.redirect('back');
    } catch (e) {
        console.log('error in submitting query');
        return res.redirect('back');
    }
})

module.exports = homeRoutes;