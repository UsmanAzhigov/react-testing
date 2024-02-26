import App from './App';
import React from 'react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { render, fireEvent, screen } from '@testing-library/react';

// Мокаем axios для тестирования
jest.mock('axios');

// Пример данных для мока axios
const hits = [
  {
    objectID: 1,
  },
];

// Тестирование функциональности axios в компоненте App
describe('Тестирование axios', () => {
  test('axios', async () => {
    // Мокаем реализацию axios.get
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          hits,
        },
      });
    });

    // Рендерим компонент App
    const { getByRole, findAllByRole } = render(<App />);

    // Симулируем клик по кнопке
    userEvent.click(getByRole('button'));

    // Проверяем, что список появился после клика
    const list = await findAllByRole('list');
    expect(list).toHaveLength(1);

    // Проверяем, что axios.get вызывается один раз
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

// Тестирование различных взаимодействий в компоненте App
describe('App', () => {
  test('рендер начального значения счетчика', () => {
    // Рендерим компонент App
    const { getByTestId } = render(<App />);

    // Проверяем, что начальное значение счетчика - '0'
    const counterValue = getByTestId('counter-value');
    expect(counterValue).toHaveTextContent('0');
  });

  test('увеличение значения счетчика по клику на кнопку', () => {
    // Рендерим компонент App
    const { getByTestId } = render(<App />);
    const counterValue = getByTestId('counter-value');
    const incrementButton = getByTestId('increment-button');

    // Симулируем клик по кнопке
    fireEvent.click(incrementButton);

    // Проверяем, что значение счетчика увеличивается до '2'
    expect(counterValue).toHaveTextContent('2');
  });

  test('проверка значения в поисковом поле', () => {
    // Рендерим компонент App
    const { getByTestId } = render(<App />);

    // Проверяем, что у поискового поля пустое значение
    const searchValue = getByTestId('search-input');
    expect(searchValue).toHaveValue('');

    // Симулируем ввод 'test' в поисковое поле
    userEvent.type(searchValue, 'test');

    // Проверяем, что теперь в поисковом поле значение 'test'
    expect(searchValue).toHaveValue('test');
  });
});

// Тестирование событий и взаимодействий
describe('События', () => {
  // Пример "плохого" кода - клик по чекбоксу с различными стилями
  it('клик по чекбоксу', () => {
    // Рендерим чекбокс с обработчиком события onChange
    const handleChange = jest.fn();
    const { container } = render(<input type="checkbox" onChange={handleChange} />);
    const checkbox = container.firstChild;

    // Проверяем начальное состояние
    expect(checkbox).not.toBeChecked();

    // Симулируем клик по чекбоксу
    userEvent.click(checkbox);

    // Проверяем, что обработчик onChange вызван и чекбокс отмечен
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });

  // Пример "плохого" кода - фокус на инпуте с различными стилями
  it('фокус на инпуте', () => {
    // Рендерим текстовый инпут с атрибутом data-testid
    const { getByTestId } = render(<input type="text" data-testid="simple-input" />);
    const input = getByTestId('simple-input');

    // Проверяем начальное состояние фокуса
    expect(input).not.toHaveFocus();

    // Симулируем фокус на инпуте
    input.focus();

    // Проверяем, что теперь инпут в фокусе
    expect(input).toHaveFocus();
  });

  // Пример "хорошего" кода - фокус с использованием единого стиля и screen
  test('фокус', () => {
    // Рендерим набор инпутов с уникальными атрибутами data-testid
    const { getAllByTestId } = render(
      <div>
        <input data-testid="element" type="checkbox" />
        <input data-testid="element" type="radio" />
        <input data-testid="element" type="number" />
      </div>,
    );

    // Получаем инпуты с помощью getAllByTestId
    const [checkbox, radio, number] = getAllByTestId('element');

    // Симулируем навигацию по табуляции
    userEvent.tab();
    expect(checkbox).toHaveFocus();
    userEvent.tab();
    expect(radio).toHaveFocus();
    userEvent.tab();
    expect(number).toHaveFocus();
  });

  test('выбор опции в селекте', () => {
    // Рендерим селект с опциями
    render(
      <select data-testid="select">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>,
    );

    // Выбираем опции с использованием userEvent.screen
    userEvent.screen.selectOptions(screen.getByRole('combobox'), '1');
    expect(screen.getByText('1').selected).toBeTruthy();

    userEvent.screen.selectOptions(screen.getByRole('combobox'), '2');
    expect(screen.getByText('2').selected).toBeTruthy();
    expect(screen.getByText('1').selected).toBeFalsy();
  });
});
