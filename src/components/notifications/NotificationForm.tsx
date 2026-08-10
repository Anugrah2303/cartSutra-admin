import { useState } from "react";
import Button from "../common/Button";
import { NotificationType, NotificationAudience } from "../../enums/notification.enum";
import { UserRole } from "../../enums/user.enum";

export interface NotificationFormOutput {
    title: string;
    message: string;
    type: NotificationType;
    audience: NotificationAudience;
    user?: string;
    role?: UserRole;
    link?: string;
}

interface NotificationFormProps {
    loading?: boolean;
    onSubmit: (data: NotificationFormOutput) => void;
    onCancel: () => void;
}

const NotificationForm = ({ loading, onSubmit, onCancel }: NotificationFormProps) => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState<NotificationType>(NotificationType.SYSTEM);
    const [audience, setAudience] = useState<NotificationAudience>(NotificationAudience.ALL);
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [link, setLink] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title.trim().length < 2 || message.trim().length < 2) return;

        onSubmit({
            title: title.trim(),
            message: message.trim(),
            type,
            audience,
            user: audience === NotificationAudience.USER ? userId.trim() : undefined,
            role: audience === NotificationAudience.ROLE ? role : undefined,
            link: link.trim() || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
            </div>

            <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Message *</label>
                <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none resize-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as NotificationType)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
                        {Object.values(NotificationType).map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Audience</label>
                    <select value={audience} onChange={(e) => setAudience(e.target.value as NotificationAudience)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
                        {Object.values(NotificationAudience).map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            {audience === NotificationAudience.USER && (
                <div>
                    <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Target user ID *</label>
                    <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Mongo user _id" className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
                </div>
            )}

            {audience === NotificationAudience.ROLE && (
                <div>
                    <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Target role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
                        {Object.values(UserRole).map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            )}

            <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Link (optional)</label>
                <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="/orders/123"
                    className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
                />
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <Button value="Cancel" variant="secondary" onClick={onCancel} />
                <Button value={loading ? "Sending..." : "Send notification"} type="submit" disable={loading} />
            </div>
        </form>
    );
};

export default NotificationForm;