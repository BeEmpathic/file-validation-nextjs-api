"use client";
import { FormEvent } from "react";

export default function Page() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    // Handle response if necessary

    console.log("Just the response:", response);
    console.log("Respone .json:", data);
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="file" name="files" />
      <button className="cursor-pointer border-solid" type="submit">
        Submit
      </button>
    </form>
  );
}
