import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Input from "../components/common/Inputs/Input";
import PasswordInput from "../components/common/Inputs/PasswordInput";
import Button from "../components/common/Button";
import { useGetUser } from "../hooks/queries/auth.queries";
import { useUpdateProfile, useUpdateAvatar, useDeleteAvatar, useChangePassword } from "../hooks/queries/profile.queries";
import { profileDetailsSchema, changePasswordSchema, type ProfileDetailsFormValues, type ChangePasswordFormValues } from "../validator/profile.validator";
import type { UserIF } from "../interface/data/user";
import Skeleton from "../components/common/skeletons/Skeleton";
import SkeletonCircle from "../components/common/skeletons/SkeletonCircle";
import SkeletonFormBlock from "../components/common/skeletons/SkeletonFormBlock";

const Profile = () => {
  const { data: currentUserData } = useGetUser<UserIF>();
  const user = currentUserData?.data;

  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  const deleteAvatar = useDeleteAvatar();
  const changePassword = useChangePassword();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register: registerDetails, handleSubmit: handleDetailsSubmit, reset: resetDetails, formState: { errors: detailsErrors } } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(profileDetailsSchema),
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (user) resetDetails({ firstName: user.firstName, lastName: user.lastName, username: user.username });
  }, [user, resetDetails]);

  if (!currentUserData) {
    return (
      <div className="flex flex-col gap-6">
        <Heading2 title="Profile" subtitle="Manage your personal information and account security" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card title="Profile photo">
            <div className="flex flex-col items-center gap-4 py-2">
              <SkeletonCircle size="h-24 w-24" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </Card>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card title="Personal information">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonFormBlock key={i} />)}
              </div>
            </Card>
            <Card title="Change password">
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonFormBlock key={i} />)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }


  const onDetailsSubmit = (values: ProfileDetailsFormValues) => updateProfile.mutate(values);
  const onPasswordSubmit = (values: ChangePasswordFormValues) => changePassword.mutate(values, { onSuccess: () => resetPassword() });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    updateAvatar.mutate(formData);
  };

  const handleAvatarDelete = () => {
    if (!user?.avatar?.PUBLIC_ID) { toast.error("No profile image to remove"); return; }
    deleteAvatar.mutate(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      <Heading2 title="Profile" subtitle="Manage your personal information and account security" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Profile photo">
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative">
              {user?.avatar?.URL ? (
                <img src={user.avatar.URL} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
                  {user?.firstName?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 cursor-pointer" style={{ backgroundColor: "var(--color-primary)", borderColor: "var(--bg-card)" }}>
                <Camera className="h-4 w-4 text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {user?.firstName} {user?.lastName}
              {user?.isSuperAdmin && <span className="ml-1.5 text-xs" style={{ color: "var(--color-primary)" }}>Super admin</span>}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user?.email}</p>

            {user?.avatar?.URL && (
              <Button value="Remove photo" variant="ghost" Icon={Trash2} options={{ className: "h-3.5 w-3.5 inline mr-1" }} disable={deleteAvatar.isPending} onClick={handleAvatarDelete} />
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Personal information">
            <form onSubmit={handleDetailsSubmit(onDetailsSubmit)} className="flex flex-col gap-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="First name" name="firstName" required register={registerDetails} />
                <Input label="Last name" name="lastName" required register={registerDetails} />
              </div>
              {detailsErrors.firstName && <p className="text-xs text-(--error)">{detailsErrors.firstName.message}</p>}
              {detailsErrors.lastName && <p className="text-xs text-(--error)">{detailsErrors.lastName.message}</p>}

              <Input label="Username" name="username" required register={registerDetails} />
              {detailsErrors.username && <p className="text-xs text-(--error)">{detailsErrors.username.message}</p>}

              <div className="flex justify-end mt-4">
                <Button value={updateProfile.isPending ? "Saving..." : "Save changes"} type="submit" disable={updateProfile.isPending} />
              </div>
            </form>
          </Card>

          <Card title="Change password">
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-1">
              <PasswordInput label="Current password" name="password" register={registerPassword} />
              {passwordErrors.password && <p className="text-xs text-(--error)">{passwordErrors.password.message}</p>}

              <PasswordInput label="New password" name="newPassword" register={registerPassword} />
              {passwordErrors.newPassword && <p className="text-xs text-(--error)">{passwordErrors.newPassword.message}</p>}

              <PasswordInput label="Confirm new password" name="conformPassword" register={registerPassword} />
              {passwordErrors.conformPassword && <p className="text-xs text-(--error)">{passwordErrors.conformPassword.message}</p>}

              <div className="flex justify-end mt-4">
                <Button value={changePassword.isPending ? "Updating..." : "Update password"} type="submit" disable={changePassword.isPending} />
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;