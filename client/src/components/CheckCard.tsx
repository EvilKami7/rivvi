import { formatDate } from '../utils/format-date.util';
import type { Check } from '../types/check.type';
import styles from './CheckCard.module.css';

type CheckCardProps = { check: Check };

export function CheckCard({ check }: CheckCardProps) {
  return (
    <article className={styles.check}>
      <div className={styles.checkHead}>
        <strong>{check.vin}</strong>
        <span className={`${styles.status} ${styles[check.status]}`}>{check.status}</span>
      </div>
      {check.status === 'completed' ? (
        <dl>
          <div>
            <dt>Автомобиль</dt>
            <dd>{`${check.make} ${check.model}`}</dd>
          </div>
          <div>
            <dt>Год выпуска</dt>
            <dd>{check.year}</dd>
          </div>
          <div>
            <dt>Владельцев</dt>
            <dd>{check.owners}</dd>
          </div>
          <div>
            <dt>ДТП</dt>
            <dd>{check.hasAccident ? 'Есть в истории' : 'Не обнаружено'}</dd>
          </div>
        </dl>
      ) : (
        <p>
          {check.status === 'failed'
            ? 'Не удалось получить данные. Попробуйте ещё раз.'
            : 'Запрашиваем данные у сервиса…'}
        </p>
      )}
      <small>Проверка: {formatDate(check.createdAt)}</small>
    </article>
  );
}
