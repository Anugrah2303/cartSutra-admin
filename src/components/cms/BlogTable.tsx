import { Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import type { BlogIF } from "../../interface/data/blog";
import { BlogStatus } from "../../enums/blog.enum";

interface BlogTableProps {
  blogs: BlogIF[];
  onEdit: (blog: BlogIF) => void;
  onDelete: (blog: BlogIF) => void;
  onTogglePublish: (blog: BlogIF) => void;
  onToggleFeatured: (blog: BlogIF) => void;
}

const STATUS_STYLES: Record<string, string> = {
  [BlogStatus.DRAFT]: "bg-gray-100 text-gray-600",
  [BlogStatus.PUBLISHED]: "bg-green-100 text-green-700",
  [BlogStatus.ARCHIVED]: "bg-red-100 text-red-700",
};

const BlogTable = ({ blogs, onEdit, onDelete, onTogglePublish, onToggleFeatured }: BlogTableProps) => {
  if (blogs.length === 0) return <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>No blogs found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Blog</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Views</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Featured</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <img src={blog.coverImage.URL} alt={blog.title} className="h-10 w-14 rounded-md object-cover" />
                  <div>
                    <p style={{ color: "var(--text-primary)" }}>{blog.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{blog.readTime} min read</p>
                  </div>
                </div>
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>{blog.views}</td>
              <td className="py-3">
                <button onClick={() => onTogglePublish(blog)} className={`rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer flex items-center gap-1 ${STATUS_STYLES[blog.status]}`}>
                  {blog.status === BlogStatus.PUBLISHED ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {blog.status}
                </button>
              </td>
              <td className="py-3">
                <button onClick={() => onToggleFeatured(blog)} className="cursor-pointer">
                  <Star className="h-4 w-4" style={{ color: blog.isFeatured ? "var(--warning)" : "var(--text-muted)" }} fill={blog.isFeatured ? "var(--warning)" : "none"} />
                </button>
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(blog)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                    <Pencil className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                  </button>
                  <button onClick={() => onDelete(blog)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                    <Trash2 className="h-4 w-4" style={{ color: "var(--error)" }} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;