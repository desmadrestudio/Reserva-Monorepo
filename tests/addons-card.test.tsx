import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import AddOnsCard, { type AddOn } from '../app/ui/booking/AddOnsCard';

// Basic unit tests for AddOnsCard component

describe('AddOnsCard', () => {
  const addons: AddOn[] = [
    { id: '1', label: 'Massage' },
    { id: '2', label: 'Sauna' },
  ];

  it('renders add-on labels', () => {
    const { getByLabelText } = render(
      <AddOnsCard addons={addons} selected={[]} onToggle={() => {}} onContinue={() => {}} />,
    );
    expect(getByLabelText('Massage')).toBeTruthy();
    expect(getByLabelText('Sauna')).toBeTruthy();
  });

  it('calls onToggle when checkbox clicked', () => {
    const onToggle = vi.fn();
    const { getByLabelText } = render(
      <AddOnsCard addons={addons} selected={[]} onToggle={onToggle} onContinue={() => {}} />,
    );
    fireEvent.click(getByLabelText('Massage'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onContinue when button clicked', () => {
    const onContinue = vi.fn();
    const { getByRole } = render(
      <AddOnsCard addons={addons} selected={['1']} onToggle={() => {}} onContinue={onContinue} />,
    );
    fireEvent.click(getByRole('button'));
    expect(onContinue).toHaveBeenCalled();
  });
});
