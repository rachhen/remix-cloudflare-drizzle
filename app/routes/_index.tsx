import { LibsqlError } from "@libsql/client";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { createUser } from "~/features/users/services/create-user";
import { deleteUser } from "~/features/users/services/delete-user";
import { getUsers } from "~/features/users/services/get-users";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const users = await getUsers(context);

  return json({ users });
};

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  if (request.method === "POST") {
    const input = Object.fromEntries(formData) as {
      name: string;
      email: string;
      password: string;
    };

    if (
      (typeof input.name !== "string" && input.name === "") ||
      (typeof input.email !== "string" && input.email === "") ||
      (typeof input.password !== "string" && input.password === "")
    ) {
      return json({ error: "Invalid input" });
    }

    try {
      await createUser(context, input);

      return json({ error: null });
    } catch (error) {
      console.log(error);
      if (error instanceof LibsqlError && error.code === "SQLITE_CONSTRAINT") {
        return json({ error: "Email already exists" });
      }

      return json({ error: "Something went wrong" });
    }
  } else if (request.method === "DELETE") {
    const id = formData.get("id");
    if (typeof id !== "string" || !id) {
      return json({ error: "Invalid input" });
    }

    try {
      await deleteUser(context, Number(id));

      return json({ error: null });
    } catch (error) {
      return json({ error: "Something went wrong" });
    }
  }
};

export default function Index() {
  const { users } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const createFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  return (
    <div className="flex flex-col min-h-screen gap-8 items-center justify-center">
      <createFetcher.Form
        method="POST"
        className="flex flex-col gap-4 border border-gray-500 p-4 rounded-md w-full max-w-sm"
      >
        <h2 className="text-4xl font-bold">Create User</h2>
        {data?.error && (
          <div className="text-red-500 bg-red-100 rounded-md p-2">
            {data.error}
          </div>
        )}
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" className="p-2 rounded-md" required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="p-2 rounded-md"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="p-2 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="p-2 rounded-md bg-blue-600 disabled:opacity-50"
          disabled={createFetcher.state === "submitting"}
        >
          {createFetcher.state === "submitting"
            ? "Creating User..."
            : "Create User"}
        </button>
      </createFetcher.Form>
      <h3 className="text-2xl font-bold">Users</h3>
      <ul className="flex flex-col gap-2 w-full max-w-sm">
        {users.map((user) => (
          <li
            key={user.id}
            className="border p-2 rounded-md flex justify-between gap-2"
          >
            <span>
              {user.name} ({user.email})
            </span>
            <deleteFetcher.Form method="DELETE">
              <button
                type="submit"
                name="id"
                value={user.id}
                className="px-2 rounded-md bg-red-600 disabled:opacity-50"
                disabled={deleteFetcher.state === "submitting"}
              >
                X
              </button>
            </deleteFetcher.Form>
          </li>
        ))}
      </ul>
    </div>
  );
}
