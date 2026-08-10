import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Folder, Search } from "lucide-react";
import type { categoryIF } from "../../interface/data/category";

interface CategoryTreeProps {
  categories: categoryIF[];
  selectedId?: string | null;
  onSelect: (category: categoryIF | null) => void;
}

interface TreeNode extends categoryIF {
  children: TreeNode[];
}

const buildTree = (categories: categoryIF[]): TreeNode[] => {
  const map = new Map<string, TreeNode>();
  categories.forEach((c) => map.set(c._id, { ...c, children: [] }));

  const roots: TreeNode[] = [];

  map.forEach((node) => {
    if (node.parent && map.has(node.parent)) {
      map.get(node.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const countDescendants = (node: TreeNode): number =>
  node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);

const CategoryTree = ({ categories, selectedId, onSelect }: CategoryTreeProps) => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const tree = useMemo(() => buildTree(categories), [categories]);

  const filteredTree = useMemo(() => {
    if (!search.trim()) return tree;

    const term = search.toLowerCase();

    const filterNode = (node: TreeNode): TreeNode | null => {
      const children = node.children.map(filterNode).filter((n): n is TreeNode => !!n);
      const matches = node.name.toLowerCase().includes(term);

      if (matches || children.length > 0) return { ...node, children };
      return null;
    };

    return tree.map(filterNode).filter((n): n is TreeNode => !!n);
  }, [tree, search]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };


  const renderNode = (node: TreeNode, depth: number) => {
    const isOpen = !!search.trim() || expanded.has(node._id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedId === node._id;

    return (
      <div key={node._id}>
        <div
          className="flex items-center justify-between gap-2 rounded-xl px-2 py-2.5 cursor-pointer hover:bg-(--bg-soft) transition-colors"
          style={{
            paddingLeft: `${depth * 20 + 8}px`,
            backgroundColor: isSelected ? "var(--bg-soft)" : "transparent",
            borderLeft: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
          }}
          onClick={() => onSelect(isSelected ? null : node)}
        >
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(node._id); }}
                className="shrink-0 cursor-pointer"
              >
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                )}
              </button>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}

            {node.avatar?.URL ? (
              <img src={node.avatar.URL} alt={node.name} className="h-6 w-6 rounded object-cover shrink-0" />
            ) : (
              <Folder className="h-4 w-4 shrink-0" style={{ color: "var(--warning)" }} fill="currentColor" fillOpacity={0.15} />
            )}

            <span
              className="text-sm truncate"
              style={{ color: isSelected ? "var(--color-primary)" : "var(--text-primary)", fontWeight: isSelected ? 600 : 400 }}
            >
              {node.name}
            </span>
          </div>

          {hasChildren && (
            <span
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-muted)" }}
            >
              {countDescendants(node)}
            </span>
          )}
        </div>

        {hasChildren && isOpen && (
          <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Category Tree</h3>

      <div className="flex items-center gap-2 rounded-full border px-4 py-2.5 mb-3 transition-shadow focus-within:shadow-md" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-soft)" }}>
        <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category..."
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <div className="flex-1 overflow-y-auto max-h-130 pr-1">
        {filteredTree.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No categories found.</p>
        ) : (
          filteredTree.map((node) => renderNode(node, 0))
        )}
      </div>

    </div>
  );
};

export default CategoryTree;