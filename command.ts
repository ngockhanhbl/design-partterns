interface Command {
    execute(): void;
    undo(): boolean;
}

class SpringWaterCommand implements Command {
    private request: string;

    constructor(request: string) {
        this.request = request;
    }

    public undo(): boolean {
        console.log("Undo");
        return true;
    }

    public execute(): void {
        console.log(`execute: SpringWaterCommand`);
    }
}

class MakePizzaCommand implements Command {
    private request: string;
    private receiver: Receiver

    /**
     * Complex commands can accept one or several receiver objects along with
     * any context data via the constructor.
     */
    constructor(request: string, receiver: Receiver) {
        this.request = request;
        this.receiver = receiver;
    }

    public undo(): boolean {
        console.log("Check to see if the dish is done");
        return Math.random() < 0.5;
    }

    /**
     * Commands can delegate to any methods of a receiver.
     */
    public execute(): void {
        console.log(`execute: MakePizzaCommand`);
        this.receiver.doSomething(`Pizza ${this.request}`);
        this.receiver.doSomethingElse(`Pizza ${this.request}`);
    }
}


/**
 * The Receiver classes contain some important business logic. They know how to
 * perform all kinds of operations, associated with carrying out a request. In
 * fact, any class may serve as a Receiver.
 */
class Receiver {
    public doSomething(request: string): void {
        console.log(`Receiver: making (${request}.)`);
    }

    public doSomethingElse(request: string): void {
        console.log(`Receiver: ${request} have completed at ${new Date().toLocaleString()}`);
    }
}

/**
 * The Invoker is associated with one or several commands. It sends a request to
 * the command.
 * like remote tv, or waiter
 */

class Invoker {
    private onStart: Command;

    private onFinish: Command;

    /**
     * Initialize commands.
     */
    public setOnStart(command: Command): void {
        this.onStart = command;
    }

    public setOnFinish(command: Command): void {
        this.onFinish = command;
    }

    /**
     * The Invoker does not depend on concrete command or receiver classes. The
     * Invoker passes a request to a receiver indirectly, by executing a
     * command.
     */
    public doSomethingImportant(): void {
        console.log('Invoker: Do you have any dishes that need to be made first before I begin?');
        if (this.isCommand(this.onStart)) {
            this.onStart.execute();
        }

        console.log('Invoker: ...doing something really important...');

        console.log('Invoker: Does anybody want something done after I finish?');
        if (this.isCommand(this.onFinish)) {
            this.onFinish.execute();
        }
    }

    private isCommand(object: Command) {
        return object.execute !== undefined;
    }
}

const invoker = new Invoker();
invoker.setOnStart(new SpringWaterCommand('With Ice'));
const receiver = new Receiver();
invoker.setOnFinish(new MakePizzaCommand('Beef', receiver));

invoker.doSomethingImportant();