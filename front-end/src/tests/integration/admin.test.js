import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import renderWithRouter from '../utils/renderWith';
import App from '../../App';
import Login from '../utils/Login';
import Logout from '../utils/Logout';
import { allUsers, allUsersNew } from './mock/admin.mock';

describe('Testes como Role Administrator', () => {
  const adminRoute = '/admin/manage';
  it('Testa se aparece todos os usuários', async () => {
    const { history } = renderWithRouter(<App />);
    const usersLength = 3;
    axios.get = jest.fn(() => Promise.resolve({ data: allUsers }));
    await Login('admin');
    expect(history.location.pathname).toBe(adminRoute);

    const deleteButton = await screen.findAllByRole('button', { name: 'Excluir' });
    expect(deleteButton.length).toBe(usersLength);
    Logout();
  });

  it('Testa se adiciona um novo Usuário', async () => {
    const { history } = renderWithRouter(<App />);
    const usersLength = 4;
    axios.get = jest.fn(() => Promise.resolve({ data: allUsers }));
    await Login('admin');
    expect(history.location.pathname).toBe(adminRoute);

    const inputName = await screen.findByTestId('admin_manage__input-name');
    const inputEmail = await screen.findByTestId('admin_manage__input-email');
    const inputPassword = await screen.findByTestId('admin_manage__input-password');
    const selectRole = await screen.findByTestId('admin_manage__select-role');
    const addUserButton = await screen.findByTestId('admin_manage__button-register');

    axios.get = jest.fn(() => Promise.resolve({ data: allUsersNew }));
    userEvent.type(inputName, 'Ricardo Pereira');
    userEvent.type(inputEmail, 'ricardopereira@email.com');
    userEvent.type(inputPassword, '12345678');
    userEvent.selectOptions(selectRole, 'Usuário');
    userEvent.click(addUserButton);
    const deleteButtons = await screen.findAllByRole('button', { name: 'Excluir' });
    expect(deleteButtons.length).toBe(usersLength);
    Logout();
  });

  it('Testa se remove o Usuário', async () => {
    const usersLength = 3;
    const { history } = renderWithRouter(<App />);
    axios.get = jest.fn(() => Promise.resolve({ data: allUsersNew }));
    await Login('admin');
    expect(history.location.pathname).toBe(adminRoute);

    axios.get = jest.fn(() => Promise.resolve({ data: allUsers }));
    const deleteButton = await screen
      .findByTestId('admin_manage__element-user-table-remove-2');
    userEvent.click(deleteButton);
    const deleteButtons = await screen.findAllByRole('button', { name: 'Excluir' });
    expect(deleteButtons.length).toBe(usersLength);
  });
});
