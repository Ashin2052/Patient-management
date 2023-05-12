import * as userService from '../services/user.service'
import {Router} from 'express';
const upload = require('../middlewares/multer');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The title of your book
 *         email:
 *           type: string
 *           description: User email
 *         role:
 *           type: string
 *           description: User role
 *       example:
 *         id: d5fE_asz
 *         name: john doe
 *         email: john@lf.com
 *         role: admin
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The auto-generated id of the book
 *         password:
 *           type: string
 *           description: The title of your book
 *       example:
 *         email: asdfa.easddfa@fasd.com
 *         password: '12345'
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User
 * /user/login:
 *   post:
 *     summary: Lists all the books
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Authentication
 *         content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Login'
 * /user/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *       500:
 *         description: Some server error
 */

router.post('/register',async (req, res, next) => {
    userService.register(req)
        .then(data => res.json(data))
        .catch(err => next(err));
});
router.post('/refresh_token', async (req, res, next) => {
    userService.generateRefreshToken(req,res)
        .then(data => res.json(data))
        .catch(err => next(err));
});

router.post('/login', async (req, res, next) => {
    userService.login(req)
        .then(data => res.json(data))
        .catch(err => next(err));
});

router.post('/logout', async (req, res, next) => {
    userService.logout(req,res)
        .then(data => res.json(data))
        .catch(err => next(err));
});

export default router;