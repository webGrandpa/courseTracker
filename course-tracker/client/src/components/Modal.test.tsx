// client/src/components/Modal.test.tsx

import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal Component', () => {

  test('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    const title = screen.queryByText('Test Modal');

    expect(title).toBeNull();
  });

  test('should render title and children when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Visible Modal">
        <div>My Modal Content</div>
      </Modal>
    );

    const title = screen.getByText('My Visible Modal');
    const content = screen.getByText('My Modal Content');

    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  test('should call onClose when the close button is clicked', () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByText('×');

    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

});