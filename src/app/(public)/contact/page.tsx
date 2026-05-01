export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        Have questions? Reach out anytime — we usually respond within a day.
      </p>
      <div className="mt-10 space-y-4 rounded-lg border border-border p-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Email</div>
          <div className="mt-1 text-sm">support@rentalapp.example</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Phone</div>
          <div className="mt-1 text-sm">+92 300 0000000</div>
        </div>
      </div>
    </section>
  );
}
