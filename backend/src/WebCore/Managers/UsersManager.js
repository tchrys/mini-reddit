const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const RegLinkRepository = require('../../Infrastructure/PostgreSQL/Repository/RegLinkRepository.js')
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const JwtPayloadDto = require('../DTOs/JwtPayloadDto.js');
const ServerError = require('../../WebApp/Models/ServerError.js');

const nodemailer = require('nodemailer');
const { hashPassword, comparePlainTextToHashedPassword } = require('../Security/Password')
const { generateTokenAsync } = require('../Security/Jwt');

const authenticateAsync = async (username, plainTextPassword) => {

    console.info(`Authenticates user with username ${username}`);

    const user = await UsersRepository.getByUsernameWithRoleAsync(username);
    
    if (!user) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 404);
    }

    if (user.is_active === false) {
        throw new ServerError(`Utilizatorul ${username} nu are contul activat`, 400);
    }

    const cmpPass = await comparePlainTextToHashedPassword(plainTextPassword, user.password);
    if (!cmpPass) {
        throw new ServerError('Password doesn\'t match!', 400);
    }

    const token = await generateTokenAsync(new JwtPayloadDto(user.id, user.role));
    return new AuthenticatedUserDto(token, username, user.role);


    /**
     * TODO
     * 
     * pas 1: verifica daca parola este buna (hint: functia compare)
     * pas 1.1.: compare returneaza true sau false. Daca parola nu e buna, arunca eroare
     * pas 2: genereaza token cu payload-ul JwtPayload
     * pas 3: returneaza AuthenticatedUserDto
     */
};

const registerAsync = async (username, plainTextPassword, email) => {
    /**
     * TODO
     * 
     * pas 1: cripteaza parola
     * pas 2: adauga (username, parola criptata) in baza de date folosind UsersRepository.addAsync
     * pas 3: returneaza RegisteredUserDto
     * 
     */
    const encryptedPass = await hashPassword(plainTextPassword);
    const user = await UsersRepository.addAsync(username, encryptedPass, email);
    const generatedToken = generateToken(20);
    console.log(generatedToken);
    await RegLinkRepository.addAsync(user.id, generatedToken);

    await sendEmail(generatedToken, email);


    return new RegisteredUserDto(user.id, user.username, user.role_id);
};

const activateAccount = async (token) => {
    const linkDbEntry = await RegLinkRepository.getByLinkAsync(token);
    console.log('##############################');
    console.log(linkDbEntry);
    if (linkDbEntry.expiry_date < new Date()) {
        throw new ServerError("Activation link expired");
    }
    await UsersRepository.activateAccount(linkDbEntry.user_id);
    await RegLinkRepository.deleteByIdAsync(token);
}

function generateToken(length) {
    const result = [];
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

const sendEmail = async(generatedToken, email) => {
    // var transport = nodemailer.createTransport({
    //     host: "smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //         user: "b7275f86aac70b",
    //         pass: "568865b9717c05"
    //     }
    // });
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    });

    const regLink = 'http://localhost:4200/activate?token=' + generatedToken;
    const message = {
        from: 'no-reply@gimme.com', // Sender address
        to: email,         // List of recipients
        subject: 'Registration link', // Subject line
        text: `Here is your activation link: ${regLink}` // Plain text body
    };
    await transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}

module.exports = {
    authenticateAsync,
    registerAsync,
    activateAccount
}