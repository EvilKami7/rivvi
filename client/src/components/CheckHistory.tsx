import type { Check } from '../types/check.type';
import { CheckCard } from './CheckCard';
import styles from './CheckHistory.module.css';

type CheckHistoryProps = { checks: Check[]; loading: boolean };

export function CheckHistory({ checks, loading }: CheckHistoryProps) {
  return (
    <section className={styles.history}>
      <div className={styles.title}>
        <h2>Последние проверки</h2>
        <span>{checks.length}</span>
      </div>
      {loading ? <p className="empty">Загружаем историю…</p> : null}
      {!loading && checks.length === 0 ? (
        <p className="empty">История пока пуста. Первая проверка появится здесь.</p>
      ) : null}
      {!loading && checks.length > 0 ? (
        <div className={styles.grid}>
          {checks.map((check) => (
            <CheckCard check={check} key={check.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
