// src/pages/CMS.tsx
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

import BannerForm from "../components/cms/BannerForm";
import BannerTable from "../components/cms/BannerTable";
import PageForm from "../components/cms/PageForm";
import PageTable from "../components/cms/PageTable";
import BlogForm from "../components/cms/BlogForm";
import BlogTable from "../components/cms/BlogTable";

import { useGetBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useToggleBanner } from "../hooks/queries/banner.queries";
import { useGetPages, useCreatePage, useUpdatePage, useDeletePage, useTogglePagePublish } from "../hooks/queries/page.queries";
import { useGetBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog, useTogglePublishBlog, useToggleFeaturedBlog } from "../hooks/queries/blog.queries";

import type { BannerIF } from "../interface/data/banner";
import type { PageIF } from "../interface/data/page";
import type { BlogIF } from "../interface/data/blog";
import { BlogStatus } from "../enums/blog.enum";

import SkeletonTable from "../components/common/skeletons/SkeletonTable";

const TABS = [
  { label: "Banners", value: "banners" },
  { label: "Pages", value: "pages" },
  { label: "Blogs", value: "blogs" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const CMS = () => {
  const [tab, setTab] = useState<TabValue>("banners");

  // ── banners ──
  const { data: bannerData, isLoading: bannersLoading } = useGetBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const toggleBanner = useToggleBanner();
  const banners: BannerIF[] = useMemo(() => bannerData?.data?.data ?? [], [bannerData]);
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerIF | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<BannerIF | null>(null);

  // ── pages ──
  const { data: pageData, isLoading: pagesLoading } = useGetPages();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();
  const togglePagePublish = useTogglePagePublish();
  const pages: PageIF[] = useMemo(() => pageData?.data?.data ?? [], [pageData]);
  const [pageFormOpen, setPageFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageIF | null>(null);
  const [deletingPage, setDeletingPage] = useState<PageIF | null>(null);

  // ── blogs ──
  const { data: blogData, isLoading: blogsLoading } = useGetBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();
  const togglePublishBlog = useTogglePublishBlog();
  const toggleFeaturedBlog = useToggleFeaturedBlog();
  const blogs: BlogIF[] = useMemo(() => blogData?.data?.data ?? [], [blogData]);
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogIF | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<BlogIF | null>(null);

  // ── banner handlers ──
  const handleBannerSubmit = (formData: FormData) => {
    if (editingBanner) {
      updateBanner.mutate({ id: editingBanner._id, data: formData }, { onSuccess: () => setBannerFormOpen(false), onError: (e) => toast.error(e.message) });
    } else {
      createBanner.mutate(formData, { onSuccess: () => setBannerFormOpen(false), onError: (e) => toast.error(e.message) });
    }
  };

  // ── page handlers ──
  const handlePageSubmit = (data: Record<string, unknown>) => {
    if (editingPage) {
      updatePage.mutate({ id: editingPage._id, data }, { onSuccess: () => setPageFormOpen(false), onError: (e) => toast.error(e.message) });
    } else {
      createPage.mutate(data, { onSuccess: () => setPageFormOpen(false), onError: (e) => toast.error(e.message) });
    }
  };

  // ── blog handlers ──
  const handleBlogSubmit = (formData: FormData) => {
    if (editingBlog) {
      updateBlog.mutate({ id: editingBlog._id, data: formData }, { onSuccess: () => setBlogFormOpen(false), onError: (e) => toast.error(e.message) });
    } else {
      createBlog.mutate(formData, { onSuccess: () => setBlogFormOpen(false), onError: (e) => toast.error(e.message) });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Content Management" subtitle="Manage banners, static pages, and blog posts" />
      </div>

      <div className="flex gap-1 mb-5 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
        {TABS.map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)} className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap" style={{ color: tab === t.value ? "var(--color-primary)" : "var(--text-muted)", borderColor: tab === t.value ? "var(--color-primary)" : "transparent" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "banners" && (
        <Card>
          <div className="flex justify-end mb-4">
            <Button value="Add banner" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={() => { setEditingBanner(null); setBannerFormOpen(true); }} />
          </div>
          {bannersLoading ? (
            <SkeletonTable rows={6} columns={5} hasAvatar />
          ) : (
            <BannerTable banners={banners} onEdit={(b) => { setEditingBanner(b); setBannerFormOpen(true); }} onDelete={setDeletingBanner} onToggle={(b) => toggleBanner.mutate(b._id, { onError: (e) => toast.error(e.message) })} />
          )}
        </Card>
      )}

      {tab === "pages" && (
        <Card>
          <div className="flex justify-end mb-4">
            <Button value="Add page" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={() => { setEditingPage(null); setPageFormOpen(true); }} />
          </div>
          {pagesLoading ? (
            <SkeletonTable rows={6} columns={4} hasAvatar={false} />
          ) : (
            <PageTable pages={pages} onEdit={(p) => { setEditingPage(p); setPageFormOpen(true); }} onDelete={setDeletingPage} onTogglePublish={(p) => togglePagePublish.mutate(p._id, { onError: (e) => toast.error(e.message) })} />
          )}
        </Card>
      )}

      {tab === "blogs" && (
        <Card>
          <div className="flex justify-end mb-4">
            <Button value="Add blog" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={() => { setEditingBlog(null); setBlogFormOpen(true); }} />
          </div>
          {blogsLoading ? (
            <SkeletonTable rows={6} columns={5} hasAvatar />
          ) : (
            <BlogTable
              blogs={blogs}
              onEdit={(b) => { setEditingBlog(b); setBlogFormOpen(true); }}
              onDelete={setDeletingBlog}
              onTogglePublish={(b) => togglePublishBlog.mutate({ id: b._id, publish: b.status !== BlogStatus.PUBLISHED }, { onError: (e) => toast.error(e.message) })}
              onToggleFeatured={(b) => toggleFeaturedBlog.mutate(b._id, { onError: (e) => toast.error(e.message) })}
            />
          )}
        </Card>
      )}

      {/* modals */}
      <Modal open={bannerFormOpen} title={editingBanner ? "Edit banner" : "Add banner"} onClose={() => setBannerFormOpen(false)} maxWidth="max-w-xl">
        <BannerForm initialData={editingBanner} loading={createBanner.isPending || updateBanner.isPending} onSubmit={handleBannerSubmit} onCancel={() => setBannerFormOpen(false)} />
      </Modal>

      <Modal open={pageFormOpen} title={editingPage ? "Edit page" : "Add page"} onClose={() => setPageFormOpen(false)} maxWidth="max-w-xl">
        <PageForm initialData={editingPage} loading={createPage.isPending || updatePage.isPending} onSubmit={handlePageSubmit} onCancel={() => setPageFormOpen(false)} />
      </Modal>

      <Modal open={blogFormOpen} title={editingBlog ? "Edit blog" : "Add blog"} onClose={() => setBlogFormOpen(false)} maxWidth="max-w-xl">
        <BlogForm initialData={editingBlog} loading={createBlog.isPending || updateBlog.isPending} onSubmit={handleBlogSubmit} onCancel={() => setBlogFormOpen(false)} />
      </Modal>

      <ConfirmDialog open={!!deletingBanner} title="Delete banner" description={`Delete "${deletingBanner?.title}"? This can't be undone.`} loading={deleteBanner.isPending} onConfirm={() => deletingBanner && deleteBanner.mutate(deletingBanner._id, { onSuccess: () => setDeletingBanner(null) })} onClose={() => setDeletingBanner(null)} />

      <ConfirmDialog open={!!deletingPage} title="Delete page" description={`Delete "${deletingPage?.title}"? This can't be undone.`} loading={deletePage.isPending} onConfirm={() => deletingPage && deletePage.mutate(deletingPage._id, { onSuccess: () => setDeletingPage(null) })} onClose={() => setDeletingPage(null)} />

      <ConfirmDialog open={!!deletingBlog} title="Delete blog" description={`Delete "${deletingBlog?.title}"? This can't be undone.`} loading={deleteBlog.isPending} onConfirm={() => deletingBlog && deleteBlog.mutate(deletingBlog._id, { onSuccess: () => setDeletingBlog(null) })} onClose={() => setDeletingBlog(null)} />
    </div>
  );
};

export default CMS;