"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    setLoading(false);

    if (response.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Identifiants incorrects.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink)"
      }}
    >
      <form
        className="card contact-box form-grid"
        onSubmit={handleSubmit}
        style={{ width: "min(360px, 90vw)" }}
      >
        <p className="kicker">Back office</p>
        <h2 style={{ marginTop: 0 }}>Connexion admin</h2>
        <input
          aria-label="Username"
          placeholder="Utilisateur"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoFocus
        />
        <input
          aria-label="Password"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p style={{ color: "#c0392b", margin: 0 }}>{error}</p>}
        <button className="button gold" type="submit" disabled={loading}>
          <LogIn size={18} aria-hidden="true" />
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
