interface CoffeeComponent {
    getPrice(): number;
}

class DefaultCoffeeImpl implements CoffeeComponent {
    getPrice(): number {
        return 5000;
    }
}

class CoffeeDecorator implements CoffeeComponent {
    protected coffee: CoffeeComponent;

    public CoffeeDecorator(coffee: CoffeeComponent) {
        this.coffee = coffee;
    }

    getPrice(): number {
        return this.coffee.getPrice();
    }
}

class MilkCoffee extends CoffeeDecorator {
    constructor(coffee: CoffeeComponent) {
        super();
        this.coffee = coffee;
    }

    MilkCoffee(coffee: CoffeeComponent) {
        this.coffee = coffee;
    }
    
    getPrice(): number {
        return super.getPrice() + this.decorateWithMilk();
    }

    decorateWithMilk(): number {
        return 3000;
    }
}

class CheeseCoffee extends CoffeeDecorator {
    constructor(coffee: CoffeeComponent) {
        super();
        this.coffee = coffee;
    }
    public CheeseCoffee(coffee: CoffeeComponent) {
        this.coffee = coffee;
    }

    getPrice(): number {
        return super.getPrice() + this.decorateWithCheese();
    }

    decorateWithCheese(): number {
        return 7000;
    }
}

const concreteComponent = new DefaultCoffeeImpl();

const milkCoffee = new MilkCoffee(concreteComponent);
const cheeseCoffee = new CheeseCoffee(concreteComponent);

const milkcheeseCoffee = new CheeseCoffee(milkCoffee);