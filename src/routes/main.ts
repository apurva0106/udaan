import { Router } from 'express'
import { verifyAdminMiddleware } from '../utils/adminAuth';
import { isLoggedIn } from '../utils/userAuth';

let mainRoutes = Router();


mainRoutes.get('/', (req, res) => {
    return res.redirect('/home');
})
mainRoutes.use('/user', isLoggedIn, require('./user/index'))
mainRoutes.use('/admin', verifyAdminMiddleware, require('./admin/index'))
mainRoutes.use('/home', require('./home/index'))


module.exports = mainRoutes;
