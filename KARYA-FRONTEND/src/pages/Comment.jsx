import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById } from "../services/taskApi";
import {
  getTaskComments,
  createComment,
  deleteComment,
  updateComment
} from "../services/commentApi";

function TaskDetails() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
const [editingContent, setEditingContent] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskResponse, commentsResponse] =
  await Promise.all([
    getTaskById(taskId),
    getTaskComments(taskId),
  ]);

console.log("COMMENTS FROM BACKEND:", commentsResponse.data);

setTask(taskResponse.data);
setComments(commentsResponse.data || []);

        
      } catch (error) {
        console.error("Task details error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load task"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const response = await createComment(
        taskId,
        content
      );

      setComments((prev) => [
        ...prev,
        response.data,
      ]);

      setContent("");
    } catch (error) {
      console.error("Create comment error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create comment"
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);

      setComments((prev) =>
        prev.filter(
          (comment) => comment._id !== commentId
        )
      );
    } catch (error) {
      console.error("Delete comment error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading task...
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="p-6 text-red-400">
        {error}
      </div>
    );
  }

  const handleEditComment = async (commentId) => {
  if (!editingContent.trim()) return;

  try {
    const response = await updateComment(
      commentId,
      editingContent
    );

    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? response.data
          : comment
          
      )
    );
 console.log("COMMENT:", Comment);
    setEditingCommentId(null);
    setEditingContent("");
  } catch (error) {
    console.error("Update comment error:", error);
    setError(
      error.response?.data?.message ||
        "Failed to update comment"
    );
  }
};
 return (
  <div className="mx-auto max-w-4xl">
    {/* Back */}
    <button
      onClick={() => navigate(`/projects/${projectId}/tasks`)}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-lime-400"
    >
      ← Back to Tasks
    </button>

    {/* Task Details */}
    <div
      className="
        relative overflow-hidden
        rounded-2xl
        border border-slate-800
        bg-slate-900/80
        p-6
        shadow-xl shadow-black/10
        sm:p-8
      "
    >
      {/* Glow */}
      <div
        className="
          pointer-events-none absolute
          -right-24 -top-24
          h-48 w-48
          rounded-full
          bg-lime-500/5
          blur-3xl
        "
      />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-lime-400">
              Task Details
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              {task?.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {task?.description || "No description provided."}
            </p>
          </div>

          {/* Edit */}
          <button
            onClick={() =>
              navigate(
                `/projects/${projectId}/tasks/${taskId}/edit`
              )
            }
            className="
              shrink-0 rounded-xl
              border border-lime-500/30
              px-4 py-2.5
              text-sm font-medium
              text-lime-400
              transition
              hover:bg-lime-500/10
              hover:border-lime-500/50
            "
          >
            Edit Task
          </button>
        </div>

        {/* Divider */}
        <div className="my-7 border-t border-slate-800" />

        {/* Task Information */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              Status
            </p>

            <p
              className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                task?.status === "completed"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : task?.status === "pending"
                    ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-400"
              }`}
            >
              {task?.status
                ? task.status.replaceAll("_", " ").toUpperCase()
                : "TODO"}
            </p>
          </div>

          {/* Priority */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              Priority
            </p>

            <p
              className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                task?.priority === "high"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : task?.priority === "medium"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    : "border-slate-700 bg-slate-800 text-slate-400"
              }`}
            >
              {task?.priority
                ? task.priority.toUpperCase()
                : "N/A"}
            </p>
          </div>

          {/* Due Date */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              Due Date
            </p>

            <p className="mt-2 text-sm font-medium text-slate-300">
              {task?.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No date"}
            </p>
          </div>

          {/* Assigned To */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              Assigned To
            </p>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-500/10 text-xs font-bold text-lime-400">
                {(
                  task?.assignedTo?.fullName ||
                  task?.assignedTo?.username ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <p className="truncate text-sm font-medium text-slate-300">
                {task?.assignedTo?.fullName ||
                  task?.assignedTo?.username ||
                  "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Comments */}
    <div className="mt-8">
      <div className="mb-5">
        <p className="text-sm font-medium text-lime-400">
          Collaboration
        </p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          Comments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Discuss this task with your team.
        </p>
      </div>

      {/* Add Comment */}
      <form
        onSubmit={handleCommentSubmit}
        className="
          rounded-2xl
          border border-slate-800
          bg-slate-900/80
          p-5
        "
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows="4"
          className="
            w-full resize-none rounded-xl
            border border-slate-800
            bg-slate-950
            px-4 py-3
            text-sm text-white
            placeholder:text-slate-600
            outline-none
            transition
            focus:border-lime-400/60
            focus:ring-2
            focus:ring-lime-400/10
          "
        />

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="
              rounded-xl
              bg-lime-500
              px-5 py-2.5
              text-sm font-semibold
              text-black
              transition
              hover:bg-lime-400
              hover:shadow-lg
              hover:shadow-lime-500/10
            "
          >
            Add Comment
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="mt-5 space-y-3">
        {comments.length === 0 ? (
          <div
            className="
              rounded-2xl
              border border-dashed border-slate-800
              bg-slate-900/40
              p-8
              text-center
            "
          >
            <p className="text-sm text-slate-500">
              No comments yet.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Start the conversation about this task.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment?._id}
              className="
                rounded-2xl
                border border-slate-800
                bg-slate-900/80
                p-5
                transition
                hover:border-slate-700
              "
            >
              {editingCommentId === comment?._id ? (
                /* Edit Comment */
                <div>
                  <textarea
                    value={editingContent}
                    onChange={(e) =>
                      setEditingContent(e.target.value)
                    }
                    rows="3"
                    className="
                      w-full resize-none rounded-xl
                      border border-slate-800
                      bg-slate-950
                      px-4 py-3
                      text-sm text-white
                      outline-none
                      transition
                      focus:border-lime-400/60
                      focus:ring-2
                      focus:ring-lime-400/10
                    "
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() =>
                        handleEditComment(comment?._id)
                      }
                      className="
                        rounded-xl
                        bg-lime-500
                        px-4 py-2
                        text-sm font-semibold
                        text-black
                        transition
                        hover:bg-lime-400
                      "
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent("");
                      }}
                      className="
                        rounded-xl
                        border border-slate-700
                        px-4 py-2
                        text-sm font-medium
                        text-slate-300
                        transition
                        hover:bg-slate-800
                      "
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal Comment */
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-lime-500/10
                        text-sm font-bold
                        text-lime-400
                      "
                    >
                      {(
                        comment?.author?.fullName ||
                        comment?.author?.username ||
                        comment?.createdBy?.fullName ||
                        comment?.createdBy?.username ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-white">
                        {comment?.author?.fullName ||
                          comment?.author?.username ||
                          comment?.createdBy?.fullName ||
                          comment?.createdBy?.username ||
                          "User"}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {comment?.content}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-4 sm:pt-1">
                    <button
                      onClick={() => {
                        setEditingCommentId(comment?._id);
                        setEditingContent(comment?.content);
                      }}
                      className="
                        text-sm font-medium
                        text-lime-400
                        transition
                        hover:text-lime-300
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteComment(comment?._id)
                      }
                      className="
                        text-sm font-medium
                        text-red-400
                        transition
                        hover:text-red-300
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}

export default TaskDetails;