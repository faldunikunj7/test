const express=require('express');
const router=express.Router();
const userService=require('../service/users/user.service');
const {check,validationResult}=require('express-validator/check');

const userBodySchema=[
    check('email','email is mandatory').not().isEmpty().isEmail(),
    check('password','password is mandatory').not().isEmpty().isLength({min: 5}),
    check('firstName',"First name is mandatory").not().isEmpty().isLength({min: 3}),
    check('lastName','last name is mandator').not().isEmpty().isLength({min: 3}),
    check('organizationName','Organization name is mandator').not().isEmpty().isLength({min: 3}),
]

// routes
router.post('/login',authenticate);
router.post('/',userBodySchema,register);
router.post('/getAll',getAll); 
router.put('/:id',userBodySchema,update);
router.delete('/:id',_delete);
router.get('/:id',getById);
// router.post('organizition/add',organization);

module.exports=router;

function organization(req,res,next) { 
    userService.addOrganization(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function authenticate(req,res,next) {
    userService.authenticate(req.body)
        .then(user => user? res.json(user):res.status(400).json({message: 'Email or password is incorrect'}))
        .catch(err => next(err));
}

function register(req,res,next) {
    const errors=validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        userService.create(req.body)
            .then((resutl) => res.json(resutl))
            .catch(err => next(err));
    }
}

function getAll(req,res,next) {
    userService.getAll(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req,res,next) {
    userService.getById(req.params.id)
        .then(user => user? res.json(user):res.json({message:"No recor found"}).sendStatus(404))
        .catch(err => next(err));
}

function update(req,res,next) {
    const errors=validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        userService.update(req.params.id,req.body)
            .then((result) => res.json(result))
            .catch(err => next(err));
    }
}

function _delete(req,res,next) {
    userService.delete(req.params.id)
        .then((result) => res.json(result))
        .catch(err => next(err));
}