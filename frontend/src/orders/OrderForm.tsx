import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { baseUrl } from "../services/urlService";
import { Form, useNavigate } from 'react-router-dom';
import { useOrders } from './OrderProvider'
interface IFormInput {
  pizzas: {
    toppings: { [key: string]: boolean };
  }[];
}

const toppingsList = [
  "Pepperoni",
  "Mushrooms",
  "Onions",
  "Sausage",
  "Bacon",
  "Extra cheese",
  "Black olives",
  "Green peppers",
  "Pineapple",
  "Spinach",
];


const OrderForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [pizzas, setPizzas] = useState([0]);
  const { addOrder } = useOrders()
  const navigate = useNavigate()
  const onSubmit = (data: IFormInput) => {
    const abortController = new AbortController();

    (async () => {
      const formattedData = {
        pizzas: data.pizzas.map(pizza => ({
          toppings: Object.keys(pizza.toppings).filter(topping => pizza.toppings[topping])
        }))
      };

      try {
        const response = await fetch(baseUrl + "/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
          signal: abortController.signal
        });
        if (response.ok) {
          const responseData = await response.json();
          addOrder(responseData);
          navigate('/orders')
        } else {
          console.log('HTTP-Error: ' + response.status);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch request has been cancelled');
        } else {
          throw err;
        }
      }
    })();

    return () => {
      abortController.abort();
    }
  };

  const addPizza = () => {
    setPizzas([...pizzas, pizzas.length]);
  }

  const removePizza = (index: number) => {
    setPizzas(pizzas.filter((_, i) => i !== index));
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {pizzas.map((pizza, index) => (
        <fieldset key={pizza} className=" m-5 border border-solid border-gray-300 p-3">
          <legend className="text-sm">Pizza {index + 1}</legend>

          {toppingsList.map((topping) => (
            <div key={topping}>
              <input
                id={`pizzas.${pizza}.toppings.${topping}`}
                {...register(`pizzas.${pizza}.toppings.${topping}`)}
                type="checkbox"
              />
              <label htmlFor={`pizzas.${pizza}.toppings.${topping}`}>{topping}</label>
            </div>
          ))}

          <button className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => removePizza(index)}>Delete Pizza</button>
        </fieldset>
      ))}
      <div className="m-5">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={addPizza}>Add Pizza</button>
      <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-3" type="submit">Submit Order</button>
      </div>
    </Form>
  );
};

export default OrderForm;
