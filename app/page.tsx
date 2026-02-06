"use client";
import { FormEvent, useState } from "react";

export default function Page() {
  const [data, setData] = useState<string>("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });
    setData(await response.json());

    // Handle response if necessary

    console.log("Just the response:", response);
    console.log("Respone .json:", data);
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="file" multiple name="files" />
      <button className="cursor-pointer border-solid" type="submit">
        Submit
      </button>
      <div id="result">{data ? data : "nothing yet"}</div>
    </form>
  );
}
