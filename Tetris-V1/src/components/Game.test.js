import { render, screen } from '@testing-library/react';
import { Game } from './Game';

const mockState = {
  isStarted: () => false,
  isRunning: () => false,
  isGameOver: () => false,
  visibleMatrix: () => [],
  nextPiece: () => null,
  score: () => 0,
  level: () => 1,
};

const mockTetris = {
  state: mockState,
  onStateChange: jest.fn(),
  start: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
};

test('renders Game component without crashing', () => {
  render(<Game tetris={mockTetris} />);
  expect(screen.getByText(/React Tetris/i)).toBeInTheDocument();
});