const TYPE_STYLES = {
  error: 'bg-tertiary/8 text-tertiary',
  success: 'bg-primary/8 text-primary',
  info: 'bg-surface-container text-on-surface',
};

export default function StatusMessage({ type = 'info', message }) {
  if (!message) return null;
  return <div className={`${TYPE_STYLES[type] || TYPE_STYLES.info} px-4 py-3 rounded-lg text-sm`}>{message}</div>;
}
