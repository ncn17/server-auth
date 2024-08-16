import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { App, WrappedApp } from './App';

/**
 * Add tests for main and not found page
 */
describe('App', () => {
  it('Renders hello world !', () => {
    // Arrange
    render(<WrappedApp />);
    screen.debug();
    // ACT // Assert oe Expect
    expect(
      screen.getByRole('heading', {
        level: 2,
      })
    ).toHaveTextContent('Hello World !');
  });

  it('Renders not found if invalid path', () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/not-exist-route']}>
        <App />
      </MemoryRouter>
    );
    // Act // Expect
    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Not Found');
  });
});
