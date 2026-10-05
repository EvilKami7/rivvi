import { CheckForm } from './components/CheckForm';
import { CheckHistory } from './components/CheckHistory';
import { useChecks } from './hooks/use-checks.hook';
import { checksApi } from './services/checks-api.service';
import styles from './App.module.css';

export function App() {
  const { checks, error, loading, setError, updateCheck } = useChecks();

  async function createCheck(vin: string) {
    setError('');
    try {
      updateCheck(await checksApi.create(vin));
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось создать проверку');
      return false;
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>AUTO INSPECT</p>
        <h1>Проверьте историю автомобиля</h1>
        <p>Введите VIN — результат появится автоматически.</p>
      </header>
      <CheckForm onSubmit={createCheck} error={error} />
      <CheckHistory checks={checks} loading={loading} />
    </main>
  );
}
