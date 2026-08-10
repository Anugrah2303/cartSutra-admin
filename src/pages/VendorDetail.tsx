import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Ban, Trash2, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import DetailRow from "../components/vendors/DetailRow";
import RejectVendorModal from "../components/vendors/RejectVendorModal";
import {
  useGetVendorById,
  useApproveVendor,
  useRejectVendor,
  useBlockVendor,
  useDeleteVendor,
} from "../hooks/queries/vendor.queries";
import { VendorApprovalStatus } from "../enums/vendor.enum";
import Skeleton from "../components/common/skeletons/Skeleton";
import SkeletonCircle from "../components/common/skeletons/SkeletonCircle";
import SkeletonStatCard from "../components/common/skeletons/SkeletonStatCard";
import SkeletonDetailRows from "../components/common/skeletons/SkeletonDetailRows";

const STATUS_STYLES: Record<string, string> = {
  [VendorApprovalStatus.PENDING]: "bg-amber-100 text-amber-700",
  [VendorApprovalStatus.UNDER_REVIEW]: "bg-blue-100 text-blue-700",
  [VendorApprovalStatus.APPROVED]: "bg-green-100 text-green-700",
  [VendorApprovalStatus.REJECTED]: "bg-red-100 text-red-700",
  [VendorApprovalStatus.SUSPENDED]: "bg-gray-100 text-gray-600",
};

const KYC_LABELS: Record<string, string> = {
  gstCertificate: "GST Certificate",
  panCard: "PAN Card",
  aadhaarFront: "Aadhaar (Front)",
  aadhaarBack: "Aadhaar (Back)",
  cancelledCheque: "Cancelled Cheque",
};

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetVendorById(id!);
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();
  const blockVendor = useBlockVendor();
  const deleteVendor = useDeleteVendor();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const vendor = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-4">
          <SkeletonCircle size="h-16 w-16" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Shop details"><SkeletonDetailRows rows={4} /></Card>
          <Card title="Bank & tax details"><SkeletonDetailRows rows={4} /></Card>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm mb-3" style={{ color: "var(--error)" }}>Vendor not found.</p>
        <Button value="Back to vendors" variant="secondary" onClick={() => navigate("/admin/vendors")} />
      </div>
    );
  }

  const handleApprove = () => {
    approveVendor.mutate(vendor._id, {
      onSuccess: () => toast.success(`${vendor.shopName} approved`),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRejectConfirm = (reason: string) => {
    rejectVendor.mutate({ id: vendor._id, rejectedReason: reason }, {
      onSuccess: () => { toast.success(`${vendor.shopName} rejected`); setRejectOpen(false); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleBlockConfirm = () => {
    blockVendor.mutate(vendor._id, {
      onSuccess: () => { toast.success(`${vendor.shopName} suspended`); setBlockOpen(false); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteConfirm = () => {
    deleteVendor.mutate(vendor._id, {
      onSuccess: () => { toast.success(`${vendor.shopName} deleted`); navigate("/admin/vendors"); },
      onError: (err) => toast.error(err.message),
    });
  };

  const kycEntries = Object.entries(vendor.kycDocuments || {}).filter(([, doc]) => doc?.URL);

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/admin/vendors")} className="flex items-center gap-1.5 text-sm cursor-pointer w-fit" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="h-4 w-4" />
        Back to vendors
      </button>

      {vendor.shopBanner?.URL && (
        <div className="h-40 w-full overflow-hidden rounded-2xl">
          <img src={vendor.shopBanner.URL} alt="banner" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {vendor.shopLogo?.URL ? (
            <img src={vendor.shopLogo.URL} alt={vendor.shopName} className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl text-xl font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
              {vendor.shopName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Heading2 title={vendor.shopName} />
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[vendor.approvalStatus] ?? "bg-gray-100 text-gray-600"}`}>
                {vendor.approvalStatus.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{vendor.vendorId} · {vendor.vendorType}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {vendor.approvalStatus !== VendorApprovalStatus.APPROVED && (
            <Button value="Approve" Icon={Check} options={{ className: "h-4 w-4 inline mr-1" }} variant="success" disable={approveVendor.isPending} onClick={handleApprove} />
          )}
          {vendor.approvalStatus !== VendorApprovalStatus.REJECTED && (
            <Button value="Reject" Icon={X} options={{ className: "h-4 w-4 inline mr-1" }} variant="secondary" onClick={() => setRejectOpen(true)} />
          )}
          {vendor.approvalStatus !== VendorApprovalStatus.SUSPENDED && (
            <Button value="Suspend" Icon={Ban} options={{ className: "h-4 w-4 inline mr-1" }} variant="danger" onClick={() => setBlockOpen(true)} />
          )}
          <Button value="Delete" Icon={Trash2} options={{ className: "h-4 w-4 inline mr-1" }} variant="danger" onClick={() => setDeleteOpen(true)} />
        </div>
      </div>

      {vendor.rejectedReason && (
        <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--error)", backgroundColor: "var(--bg-soft)", color: "var(--error)" }}>
          <strong>Rejection reason:</strong> {vendor.rejectedReason}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card><p className="text-xs" style={{ color: "var(--text-muted)" }}>Revenue</p><p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>₹{vendor.totalRevenue.toLocaleString()}</p></Card>
        <Card><p className="text-xs" style={{ color: "var(--text-muted)" }}>Orders</p><p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{vendor.totalOrders}</p></Card>
        <Card><p className="text-xs" style={{ color: "var(--text-muted)" }}>Products</p><p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{vendor.totalProducts}</p></Card>
        <Card><p className="text-xs" style={{ color: "var(--text-muted)" }}>Wallet balance</p><p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>₹{vendor.walletBalance.toLocaleString()}</p></Card>
        <Card><p className="text-xs" style={{ color: "var(--text-muted)" }}>Commission</p><p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{vendor.commissionRate}%</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Shop details">
          {vendor.shopDescription && <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{vendor.shopDescription}</p>}
          <DetailRow label="Support email" value={vendor.supportEmail} />
          <DetailRow label="Support phone" value={vendor.supportPhone} />
          <DetailRow label="Dispatch time" value={`${vendor.estimatedDispatchDays} day(s)`} />
          <DetailRow label="Vacation mode" value={vendor.isVacationMode ? "On" : "Off"} />
          {vendor.website && (
            <div className="flex justify-between py-2 text-sm">
              <span style={{ color: "var(--text-muted)" }}>Website</span>
              <a href={vendor.website} target="_blank" rel="noreferrer" className="flex items-center gap-1" style={{ color: "var(--color-primary)" }}>
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </Card>

        <Card title="Bank & tax details">
          <DetailRow label="Account holder" value={vendor.bankDetails?.accountHolderName} />
          <DetailRow label="Account number" value={vendor.bankDetails?.accountNumber} />
          <DetailRow label="Bank" value={vendor.bankDetails?.bankName} />
          <DetailRow label="IFSC" value={vendor.bankDetails?.ifscCode} />
          <DetailRow label="GST number" value={vendor.taxDetails?.gstNumber} />
          <DetailRow label="PAN number" value={vendor.taxDetails?.panNumber} />
        </Card>

        <Card title="Business address">
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            {vendor.businessAddress?.addressLine1}{vendor.businessAddress?.addressLine2 ? `, ${vendor.businessAddress.addressLine2}` : ""}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {vendor.businessAddress?.city}, {vendor.businessAddress?.state} {vendor.businessAddress?.postalCode}, {vendor.businessAddress?.country}
          </p>
        </Card>

        <Card title="Pickup address">
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            {vendor.pickupAddress?.addressLine1}{vendor.pickupAddress?.addressLine2 ? `, ${vendor.pickupAddress.addressLine2}` : ""}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {vendor.pickupAddress?.city}, {vendor.pickupAddress?.state} {vendor.pickupAddress?.postalCode}, {vendor.pickupAddress?.country}
          </p>
        </Card>
      </div>

      <Card title="KYC documents">
        {kycEntries.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>No documents uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {kycEntries.map(([key, doc]) => (
              <a key={key} href={doc!.URL} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-lg border p-3 hover:bg-(--bg-soft)" style={{ borderColor: "var(--border-light)" }}>
                <img src={doc!.URL} alt={key} className="h-20 w-full rounded-md object-cover" />
                <span className="flex items-center gap-1 text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                  <FileText className="h-3 w-3" /> {KYC_LABELS[key] ?? key}
                </span>
              </a>
            ))}
          </div>
        )}
      </Card>

      <Card title="Timeline">
        <DetailRow label="Registered" value={format(new Date(vendor.createdAt), "MMM d, yyyy 'at' h:mm a")} />
        {vendor.approvedAt && <DetailRow label="Approved" value={format(new Date(vendor.approvedAt), "MMM d, yyyy 'at' h:mm a")} />}
        {vendor.lastPayoutAt && <DetailRow label="Last payout" value={format(new Date(vendor.lastPayoutAt), "MMM d, yyyy")} />}
      </Card>

      <RejectVendorModal open={rejectOpen} shopName={vendor.shopName} loading={rejectVendor.isPending} onConfirm={handleRejectConfirm} onClose={() => setRejectOpen(false)} />

      <ConfirmDialog
        open={blockOpen}
        title="Suspend vendor"
        description={`Are you sure you want to suspend "${vendor.shopName}"? Their products will no longer be visible.`}
        loading={blockVendor.isPending}
        onConfirm={handleBlockConfirm}
        onClose={() => setBlockOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete vendor"
        description={`Are you sure you want to delete "${vendor.shopName}"? This can't be undone.`}
        loading={deleteVendor.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default VendorDetail;