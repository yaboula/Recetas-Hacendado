export function Spinner({ large }) {
  return <div className={large ? 'spinner spinner-lg' : 'spinner'} />;
}

export function PageSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spinner large />
    </div>
  );
}
