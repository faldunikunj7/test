const {jwtToken}=require('../../config/config/config');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const db=require('../../config/database/db');
const User=db.User;
const Org=db.Organization;

module.exports={
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addOrganization
};

async function authenticate({email,password}) {
    const user=await User.findOne({email});
    if(user&&bcrypt.compareSync(password,user.password)) {
        const token=jwt.sign({sub: user.id},jwtToken.secretKey,{expiresIn: jwtToken.expiresIn});
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function addOrganization(req) {
    const org=new Org(req);
    await org.save();
}

async function getAll(body) {
    let query={};
    const limit=parseInt(body.limit)||10,
        page=body.page? parseInt(body.page===0)? 0:(parseInt(body.page)-1):0;
    const sort=body.sort||{_id: -1};
    if(body.search) {
        const regex=new RegExp(body.search,"i");
        query={
            $or: [{'email': regex},
            {'firstName': regex},
            {'lasrName': regex},
            {'organizationName': regex},
            ]
        };
    }
    return await User.find(query).limit(limit).skip(page*limit).sort(sort);
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if(await User.findOne({email: userParam.email})) {
        throw 'Email "'+userParam.email+'" is already taken';
    }

    const organizationDetails=await Org.findOne({name: userParam.organizationName});
    if(!organizationDetails) {
        throw 'Organization name "'+userParam.organizationName+'" not found in our record';
    }

    userParam.organizationId=organizationDetails._id;
    const user=new User(userParam);

    // hash password
    if(userParam.password) {
        user.password=bcrypt.hashSync(userParam.password,10);
    }

    // save user
    await user.save();
}

async function update(id,userParam) {
    const user=await User.findById(id);

    // validate
    if(!user) throw 'User not found';
    if(user.email!==userParam.email&&await User.findOne({email: userParam.email})) {
        throw 'Username "'+userParam.username+'" is already taken';
    }
    const organizationDetails=await Org.findOne({name: userParam.organizationName});
    if(!organizationDetails) {
        throw 'Organization name "'+userParam.organizationName+'" not found in our record';
    }
    // hash password if it was entered
    if(userParam.password) {
        userParam.hash=bcrypt.hashSync(userParam.password,10);
    }
    Object.assign(user,userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}