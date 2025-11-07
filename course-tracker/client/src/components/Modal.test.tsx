// client/src/components/Modal.test.tsx

// 1. Импорты (Vitest "увидит", что нам нужны 'test', 'expect'...)
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

// 2. "Группа" тестов
describe('Modal Component', () => {

  // Тест-кейс 1: "Не должен ничего рисовать, если isOpen=false"
  test('should not render when isOpen is false', () => {
    // "Рисуем" компонент с isOpen: false
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    // "Смотрим" на экран: "Найди мне текст 'Test Modal'"
    // 'queryByText' - лучший способ проверить, что чего-то НЕТ (он вернет null)
    const title = screen.queryByText('Test Modal');

    // "Ожидаем", что "заголовок" - это 'null'
    expect(title).toBeNull();
  });

  // Тест-кейс 2: "Должен рисовать заголовок и 'детей', если isOpen=true"
  test('should render title and children when isOpen is true', () => {
    // "Рисуем" компонент с isOpen: true
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Visible Modal">
        <div>My Modal Content</div>
      </Modal>
    );

    // "Смотрим" на экран: "Найди мне текст..."
    // 'getByText' - лучший способ проверить, что что-то ЕСТЬ (он выдаст ошибку, если не найдет)
    const title = screen.getByText('My Visible Modal');
    const content = screen.getByText('My Modal Content');

    // "Ожидаем", что они "нарисованы на экране"
    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  // Тест-кейс 3: "Должен вызывать onClose, когда кликаем на 'X'"
  test('should call onClose when the close button is clicked', () => {
    // 1. Создаем "шпиона" (mock-функцию)
    const mockOnClose = vi.fn();

    // 2. "Рисуем"
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    // 3. "Ищем" кнопку "X" (по ее тексту)
    const closeButton = screen.getByText('×');

    // 4. "Робот" "кликает" (fireEvent) по кнопке
    fireEvent.click(closeButton);

    // 5. "Ожидаем", что наш "шпион" был "вызван" 1 раз
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

});