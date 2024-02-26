import App from './App';
import React from 'react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';

jest.mock('axios');

const hits = [
  {
    objectID: 1,
  },
];

describe('axios test', () => {
  test('axios', async () => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          hits,
        },
      });
    });
    const { getByRole, findAllByRole } = render(<App />);

    userEvent.click(getByRole('button'));
    const list = await findAllByRole('list');
    expect(list).toHaveLength(1);

    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

// использование userEvent вместо fireEvent эмулирует лучше сценарий выполнения тест чем fireEvent

describe('App', () => {
  test('renders initial counter value', () => {
    const { getByTestId } = render(<App />);
    const counterValue = getByTestId('counter-value');
    expect(counterValue).toHaveTextContent('0');
  });

  test('chech search value', () => {
    const { getByTestId } = render(<App />);
    const searchValue = getByTestId('search-input');
    expect(searchValue).toHaveValue('');

    // fireEvent.change(searchValue, { target: { value: 'test' } });
    userEvent.type(searchValue, 'test');
    expect(searchValue).toHaveValue('test');
  });

  test('increments counter value on button click', () => {
    const { getByTestId } = render(<App />);
    const counterValue = getByTestId('counter-value');
    const incrementButton = getByTestId('increment-button');

    fireEvent.click(incrementButton);
    expect(counterValue).toHaveTextContent('2');
  });
});

describe('events', () => {
  // bad  использоваение деструктуризации и разные стили

  it('checkbox click', () => {
    const handleChange = jest.fn();
    const { container } = render(<input type="checkbox" onChange={handleChange} />);
    const checkbox = container.firstChild;
    expect(checkbox).not.toBeChecked();
    userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });

  it('input focus', () => {
    const { getByTestId } = render(<input type="text" data-testid="simple-input" />);
    const input = getByTestId('simple-input');
    expect(input).not.toHaveFocus();
    input.focus();
    expect(input).toHaveFocus();
  });

  // good использование одного стиля вместо двух и использование screen, а не деструктуризацией

  test('focus', () => {
    const { getAllByTestId } = render(
      <div>
        <input data-testid="element" type="checkbox" />
        <input data-testid="element" type="radio" />
        <input data-testid="element" type="number" />
      </div>,
    );

    const [checkbox, radio, number] = getAllByTestId('element');
    userEvent.tab();
    expect(checkbox).toHaveFocus();
    userEvent.tab();
    expect(radio).toHaveFocus();
    userEvent.tab();
    expect(number).toHaveFocus();
  });

  test('select option', () => {
    render(
      <select data-testid="select">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>,
    );
    userEvent.screen.selectOptions(screen.getByRole('combobox'), '1');
    expect(screen.getByText('1').selected).toBeTruthy();
    userEvent.selectOptions(getByRole('combobox'), '2');
    expect(screen.getByText('2').selected).toBeTruthy();
    expect(screen.getByText('1').selected).toBeFalsy();
  });
});

// https://www.youtube.com/watch?v=RyR6jM7pp4g лучшие практики тестов
