import { useState, type SubmitEvent } from 'react';
import styles from './CheckForm.module.css';

const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
type CheckFormProps = { onSubmit: (vin: string) => Promise<boolean>; error: string };

export function CheckForm({ onSubmit, error }: CheckFormProps) {
  const [vin, setVin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const normalizedVin = vin.trim().toUpperCase();

    if (!vinPattern.test(normalizedVin)) {
      setValidationError('VIN должен состоять из 17 символов: латинские буквы и цифры, без I, O, Q.');
      return;
    }

    setValidationError('');
    setSubmitting(true);
    try {
      const isCreated = await onSubmit(normalizedVin);
      if (isCreated) setVin('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.panel}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="vin">VIN автомобиля</label>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            id="vin"
            value={vin}
            onChange={(event) => setVin(event.target.value.toUpperCase())}
            maxLength={17}
            placeholder="Например, 1HGCM82633A004352"
            autoComplete="off"
          />
          <button className={styles.button} disabled={submitting}>
            {submitting ? 'Отправляем…' : 'Проверить автомобиль'}
          </button>
        </div>
        {validationError || error ? (
          <p className={styles.error} role="alert">
            {validationError || error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
