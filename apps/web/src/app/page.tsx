"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await apiFetch("/books", {method: "GET"});

      const data = await response.json();

      console.log(data);
    };

    void fetchBooks();
  }, []);

  return (
    <main>
      <h1>Book Record</h1>

      {isLoggedIn ? <p>ログインしています</p> : <p>ログインしていません</p>}
    </main>
  );
}
