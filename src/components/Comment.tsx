import { IComment } from "../interfaces";

type Props = { comment: IComment; onDelete: () => void };

export function Comment(props: Props) {
  const comment = props.comment;
  const onDelete = props.onDelete;
  return (
    <p>
      <span data-testid="comment">{comment.comment}</span> by{" "}
      <span data-testid="author">{comment.createdBy?.email || "Unknown"}</span>{" "}
      at {comment.createdAt}
      <button onClick={onDelete} data-testid="delete">
        Delete
      </button>
    </p>
  );
}
