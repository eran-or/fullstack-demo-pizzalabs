declare class PizzaProcessingService {
    private doughPrepTime;
    private toppingPrepTime;
    private cookingTime;
    private servingTime;
    processOrder(orderId: string): Promise<void>;
    private prepareDough;
    private prepareToppings;
    private cookPizza;
    private servePizza;
    private sleep;
}
declare const _default: PizzaProcessingService;
export default _default;
