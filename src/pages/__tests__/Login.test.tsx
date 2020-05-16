
import React from 'react';
import { render, screen, findByText, findAllByText, within } from '@testing-library/react';
import Login from '../Login';
import { MemoryRouter } from "react-router-dom";


describe("Login Page", () => {


    test("Rendering", async () => {

        const { findByText, findAllByText } = render(<MemoryRouter><Login/></MemoryRouter>);
        // await findAllByText("Login"); 
        const elementList = await findAllByText("Login");
        const loginButton = elementList.filter(item => item.nodeName === "ION-BUTTON");
        console.log(loginButton);

       expect(loginButton).toBeDefined();
    });

});