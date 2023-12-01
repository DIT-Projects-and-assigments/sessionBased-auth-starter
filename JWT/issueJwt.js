const base64url = require('base64url')
const crypto = require('crypto')
const signatureFunciton = crypto.createSign('RSA-SHA256')
const fs = require('fs')


const headerObj = {
    alg: 'RS256',
    type: 'JWT'
}

const payloadObj = {
    name: 'Tajir Ramadhan',
    admin: false,
    sub: '1234567890',
    iat: 151623
}


/*
* Stringfy objects so as to be able to hash them

*/
const headerObjString = JSON.stringify(headerObj)
const payloadObjString = JSON.stringify(payloadObj)


/*
* encoding the strings to the base64 format
*/
const base64urlHeader = base64url(headerObjString)
const base64urlPayload = base64url(payloadObjString)


signatureFunciton.write(base64urlHeader + '.' + base64urlPayload )
signatureFunciton.end()

const PRIV_KEY = fs.readFileSync( __dirname + '/id_rsa_priv.pem', 'utf8')
const signatureBase64 = signatureFunciton.sign(PRIV_KEY, 'base64')



/*
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const jwtParts = jwt.split('.')

console.log(jwtParts)

const headerInbase64Format = jwtParts[0]
const bodyInbase64Format = jwtParts[1]
const signatureInbase64Format = jwtParts[2]

 
const decodedHeader = base64url.decode(headerInbase64Format)
const decodedBody = base64url.decode(bodyInbase64Format)
const decodedSignature = base64url.decode(signatureInbase64Format)

console.log(decodedHeader)
console.log(decodedBody)
console.log(decodedSignature)
*/