var express = require('express');
var router = express.Router();
const config = require('../config')
const jwt = require("jsonwebtoken")

const {tokenChecker}= require('../tokenChecker')

const tokenList = {}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json({"success":true,"message":"Get function called!" })
});


router.post('/login', (req, res) => {
    
    const postData = req.body;
    
    const user = {
        "email": postData.email,
        "name": postData.name
    }
    
    // Detail of signing token is available on Readme.txt file.
        var signOptions = {
            header: {alg:"HS256", typ:"JWT", kid:"5FZT6gTLM5wEoSGn3eW0Q8zCPsQ"},
            expiresIn:  "25s"
        };

    const access_token = jwt.sign(user, config.secret, signOptions);
   
        
    const refreshToken = jwt.sign(user, config.refreshTokenSecret,
        {
            header: { expiresIn:"1d",alg: "HS256", typ: "JWT", kid: "4554545454dfdjksdjfijdfjdf" }
        })
    
    const response = {
        "status": "Logged in",
        "access_token": access_token,
        "refreshToken": refreshToken,
    }
    tokenList[refreshToken] = response
    res.status(200).json(response);
})

router.post('/token', (req, res) => {
    // refresh the damn token
    const postData = req.body
    console.log(postData)
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }
        var signOptions = {
            header: {alg:"HS256", typ:"JWT", kid:"5FZT6gTLM5wEoSGn3eW0Q8zCPsQ"},
            expiresIn:  "25s"
        };

    const access_token = jwt.sign(user, config.secret, signOptions);
            
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);        
    } else {
        res.status(404).send('Invalid request')
    }
})

router.use(require('../tokenChecker'))

router.get('/secure', (req,res) => {
    // all secured routes goes here
    res.send('I am secured...')
})

module.exports = router;
