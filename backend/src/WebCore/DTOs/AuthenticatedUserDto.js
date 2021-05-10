class AuthenticatedUserDto {
    constructor (token, username, role) {
        this.token = token;
        this.role = role;
        this.username = username;
    }

    get Token() {
        return this.token;
    }

    get Role() {
        return this.role;
    }

    get Username() {
        return this.username;
    }
}

module.exports = AuthenticatedUserDto;