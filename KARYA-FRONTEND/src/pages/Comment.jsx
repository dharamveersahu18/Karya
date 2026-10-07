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
        onClick={() =>
          navigate(`/projects/${projectId}/tasks`)
        }
        className="mb-5 text-sm text-slate-400 hover:text-white"
      >
        ← Back to Tasks
      </button>

      {/* Task */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {task.title}
            </h1>

            <p className="mt-3 text-slate-400">
              {task.description || "No description"}
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                `/projects/${projectId}/tasks/${taskId}/edit`
              )
            }
            className="rounded-lg border border-lime-500/30 px-4 py-2 text-sm text-lime-400 hover:bg-lime-500/10"
          >
            Edit
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
          <span>Status: {task.status}</span>

          <span>Priority: {task.priority}</span>

          <span>
            Due:{" "}
            {task.dueDate
              ? new Date(
                  task.dueDate
                ).toLocaleDateString()
              : "No date"}
          </span>

          <span>
            Assigned To:{" "}
            {task.assignedTo?.fullName ||
              task.assignedTo?.username ||
              "Not assigned"}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          Comments
        </h2>

        {/* Add comment */}
        <form
          onSubmit={handleCommentSubmit}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Write a comment..."
            rows="3"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-lime-400"
          />

          <button
            type="submit"
            className="mt-3 rounded-lg bg-lime-500 px-4 py-2 font-medium text-black hover:bg-lime-400"
          >
            Add Comment
          </button>
        </form>

        {/* Comment list */}
        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="text-slate-500">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <div
  key={comment._id}
  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
>
  {editingCommentId === comment._id ? (
    <div>
      <textarea
        value={editingContent}
        onChange={(e) =>
          setEditingContent(e.target.value)
        }
        rows="3"
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-lime-400"
      />

      <div className="mt-3 flex gap-3">
        <button
          onClick={() =>
            handleEditComment(comment._id)
          }
          className="rounded-lg bg-lime-500 px-3 py-2 text-sm font-medium text-black hover:bg-lime-400"
        >
          Save
        </button>

        <button
          onClick={() => {
            setEditingCommentId(null);
            setEditingContent("");
          }}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-between gap-4">
      <div>
        <p className="font-medium">
          {comment.author?.fullName ||
            comment.author?.username ||
            comment.createdBy?.fullName ||
            comment.createdBy?.username 
            }
        </p>

        <p className="mt-2 text-slate-400">
          {comment.content}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setEditingCommentId(comment._id);
            setEditingContent(comment.content);
          }}
          className="text-sm text-lime-400 hover:text-lime-300"
        >
          Edit
        </button>

        <button
          onClick={() =>
            handleDeleteComment(comment._id)
          }
          className="text-sm text-red-400 hover:text-red-300"
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