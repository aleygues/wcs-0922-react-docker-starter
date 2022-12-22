import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Comment } from "./Comment";
import { IComment } from "../interfaces";

test("render and display comment from anonym person", async () => {
  // ARRANGE
  render(
    <Comment
      onDelete={() => {}}
      comment={{
        id: 1,
        comment: "Super test!",
        createdBy: undefined,
        createdAt: new Date().toISOString(),
      }}
    />
  );

  expect(screen.getByTestId("comment")).toHaveTextContent("Super test!");
  expect(screen.getByTestId("author")).toHaveTextContent("Unknown");
});

test("render and display comment from known person", async () => {
  // ARRANGE
  render(
    <Comment
      onDelete={() => {}}
      comment={{
        id: 1,
        comment: "Super test!",
        createdBy: {
          email: "aurelien@gmail.com",
        } as unknown as IComment["createdBy"],
        createdAt: new Date().toISOString(),
      }}
    />
  );

  expect(screen.getByTestId("comment")).toHaveTextContent("Super test!");
  expect(screen.getByTestId("author")).toHaveTextContent("aurelien@gmail.com");
});

test("render a deletable comment", async () => {
  // ARRANGE
  const onDelete = jest.fn();
  render(
    <Comment
      onDelete={onDelete}
      comment={{
        id: 1,
        comment: "Super test!",
        createdBy: {
          email: "aurelien@gmail.com",
        } as unknown as IComment["createdBy"],
        createdAt: new Date().toISOString(),
      }}
    />
  );

  expect(onDelete.mock.calls.length).toBe(0);
  screen.getByTestId("delete").click();
  expect(onDelete.mock.calls.length).toBe(1);
});
