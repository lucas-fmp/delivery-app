import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithRouter from "../utils/renderWith";
import App from "../../App";
import Login from "../utils/Login";
import axios from "axios";
import Logout from "../utils/Logout";

jest.mock("axios");

describe("Testes no fluxo de clientes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Tela de Produtos", async () => {
    const { history } = renderWithRouter(<App />);

    const mockProducts = [
      {
        id: 1,
        name: "Skol Lata 250ml",
        price: "2.20",
        urlImage: "http://localhost:3001/images/skol_lata_350ml.jpg",
      },
    ];

    axios.get.mockResolvedValue({ data: mockProducts });

    await Login("costumer");

    const cardItem = screen.getByTestId(
      "customer_products__element-card-title-1"
    );
    const quantity = screen.getByTestId(
      "customer_products__input-card-quantity-1"
    );
    const increase = screen.getByTestId(
      "customer_products__button-card-add-item-1"
    );
    const decrease = screen.getByTestId(
      "customer_products__button-card-rm-item-1"
    );

    expect(cardItem).toBeInTheDocument();

    userEvent.click(increase);
    userEvent.click(decrease);
    userEvent.type(quantity, "10");

    const buttonCart = screen.getByTestId("customer_products__button-cart");

    userEvent.click(buttonCart);

    await screen.findByTestId("customer_checkout__button-submit-order");

    expect(history.location.pathname).toBe("/customer/checkout");

    await Logout();
  });

  it("Tela de Checkout", async () => {
    localStorage.setItem(
      "cart",
      JSON.stringify([
        { name: "Skol Lata 250ml", price: 2.2, quantity: 5, id: 1 },
        { name: "Bhrama Lata 250ml", price: 2.5, quantity: 8, id: 2 },
      ])
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Cliente Zé Birita",
        email: "zebirita@email.com",
        token:
          "eyJhbGciOiJIUzI1NiJ9.Mw.OW7ZXw5IGgg6GVIvvSao2jVyQcDLP2Ld7v9uaYr_b7g",
        role: "customer",
      })
    );

    const { history } = renderWithRouter(<App />);

    const mockSellers = [
      {
        email: "fulana@deliveryapp.com",
        id: 2,
        name: "Fulana Pereira",
        password: "3c28d2b0881bf46457a853e0b07531c6",
        role: "seller",
      },
    ];

    axios.get.mockResolvedValue({ data: mockSellers });

    axios.post.mockResolvedValue({ data: { id: 1 } });

    history.push("/customer/checkout");

    const removeButton = await screen.findByTestId(
      "customer_checkout__element-order-table-remove-0"
    );

    userEvent.click(removeButton.firstChild);

    expect(removeButton).not.toBeInTheDocument();

    const finishOrderButton = screen.getByTestId(
      "customer_checkout__button-submit-order"
    );
    
    userEvent.click(finishOrderButton);

    console.log(screen.logTestingPlaygroundURL());
  });

  it("Tela de Pedidos", () => {
    const { history } = renderWithRouter(<App />);

    const mockOrders = [
      {
        deliveryAddress: "Marina Rodovia",
        deliveryNumber: "498",
        id: 1,
        saleDate: "2023-01-26T19:32:50.000Z",
        sellerId: 2,
        seller_id: 2,
        status: "Pendente",
        totalPrice: "52.72",
        userId: 3,
      },
    ];

    axios.get.mockResolvedValue({ data: mockOrders });

    history.push("/customer/orders");
  });
});
