const userFakes = [{username: "admin@gmail.com", password: "abc123"}, {username: "user@gmail.com", password: "abc123"}]

interface Middleware {
    setNext(middleware: Middleware): Middleware;

    handle(username: string, password: string): string;
}

abstract class AbstractMiddleware implements Middleware
{
    private next: Middleware;

    public setNext(middleware: Middleware): Middleware {
        this.next = middleware;
        return middleware;
    }

    public handle(username: string, password: string): string {
        if (this.next) {
            return this.next.handle(username, password);
        }

        return '';
    }
}

class CheckValidPayload extends AbstractMiddleware {
    public handle(username: string, password: string): string {
        if (username.length < 6 || password.length < 6) {
            return `Username or Password must be greater than 6 charactor.`;
        }
        return super.handle(username, password);

    }
}

class CheckEmailExits extends AbstractMiddleware {
    public handle(username: string, password: string): string {
        const users = userFakes.filter((x) => x.username === username);
        if (!users.length) {
            return `Username not exits.`;
        }
        return super.handle(username, password);

    }
}

class Login extends AbstractMiddleware {
    public handle(username: string, password: string): string {
        const users = userFakes.filter((x) => x.username === username);
        if (!users.length) {
            return `User is not exits.`;
        }

        const user = users[0];

        if (user.password !== password) {
            return `The password is incorrect. Try again`;
        }

        return JSON.stringify(user);
    }
}

function clientCode(middleware: Middleware) {
    const payload = {username: "admin@gmail.com", password: "123456"};

    console.log(`Logging..`);
    const result = middleware.handle(payload.username, payload.password);

    console.log(`${result}`);
}

const checkValidMiddleware = new CheckValidPayload();
const checkEmailExitsMiddleware = new CheckEmailExits();
const loginMiddleware = new Login();

checkValidMiddleware.setNext(checkEmailExitsMiddleware).setNext(loginMiddleware);

clientCode(checkValidMiddleware);

