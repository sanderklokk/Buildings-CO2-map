import { render, screen, fireEvent } from '@testing-library/react';
import AddMaterial from '../../../components/adminComponents/AddMaterial';
import { describe, it, vi, expect } from 'vitest';

describe('AddMaterial', () => {
  const setup = (overrideProps = {}) => {
    const onClose = vi.fn();
    const onAdd = vi.fn();
    const props = {
      open: true,
      onClose,
      onAdd,
      ...overrideProps,
    };

    render(<AddMaterial {...props} />);
    return { onClose, onAdd };
  };

  it('checks render correct', () => {
    setup();
    expect(screen.getByText('Legg til nytt hovedmateriale')).toBeInTheDocument();
    expect(screen.getByLabelText('Materialnavn')).toBeInTheDocument();
    expect(screen.getByLabelText('Farlig materiale')).toBeInTheDocument();
  });

  it('check name input works', () => {
    setup();
    const matnavn = screen.getByLabelText('Materialnavn') as HTMLInputElement;
    fireEvent.change(matnavn, { target: { value: 'plaaanker' } });
    expect(matnavn.value).toBe('plaaanker');
  });

  it('check dangerous switch works', () => {
    setup();
    const dangerousswitch = screen.getByLabelText('Farlig materiale') as HTMLInputElement;
    expect(dangerousswitch.checked).toBe(false);
    fireEvent.click(dangerousswitch);
    expect(dangerousswitch.checked).toBe(true);
  });

  it('check onadd called correctly', () => {
    const { onAdd, onClose } = setup();
    fireEvent.change(screen.getByLabelText('Materialnavn'), { target: { value: 'restavfall' } });
    fireEvent.click(screen.getByLabelText('Farlig materiale'));
    fireEvent.click(screen.getByText('Legg til'));

    expect(onAdd).toHaveBeenCalledWith('restavfall', true);
    expect(onClose).toHaveBeenCalled();
  });

  it('check onadd called correctly (with other values)', () => {
    const { onAdd, onClose } = setup();
    fireEvent.change(screen.getByLabelText('Materialnavn'), { target: { value: 'bly' } });

    fireEvent.click(screen.getByLabelText('Farlig materiale'));
    fireEvent.click(screen.getByLabelText('Farlig materiale'));
    fireEvent.click(screen.getByLabelText('Farlig materiale'));
    fireEvent.click(screen.getByLabelText('Farlig materiale'));
    
    fireEvent.click(screen.getByText('Legg til'));

    expect(onAdd).toHaveBeenCalledWith('bly', false);
    expect(onClose).toHaveBeenCalled();
  });

  it('check close on cancel', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByText('Avbryt'));
    expect(onClose).toHaveBeenCalled();
  });
});
