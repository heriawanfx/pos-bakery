import './App.css'
function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-md w-full space-y-4 rounded-2xl bg-card border border-border p-6 shadow-sm">
        <h1 className="text-xl font-semibold">
          PoS Bakery – Theme Check
        </h1>
        <p className="text-sm text-muted-foreground">
          If you see a cream background and brown-ish text, Tailwind + theme tokens
          are working.
        </p>

        <div className="flex gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Primary Button
          </button>
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90">
            Secondary
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Dark mode will work later when we add a theme toggle and apply <code>.dark</code> on
          <code>html</code>.
        </p>
      </div>
    </div>
  );
}

export default App;

