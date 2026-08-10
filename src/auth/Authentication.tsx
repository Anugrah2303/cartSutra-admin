import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetUser } from "../hooks/queries/auth.queries";
import type { UserIF } from "../interface/data/user";
import FullPageAuthSkeleton from "../components/common/skeletons/FullPageAuthSkeleton";

const Authentication = () => {
    const navigate = useNavigate();
    const { data, isError, isPending } = useGetUser<UserIF>();

    useEffect(() => {
        if (isPending) return;
        if (isError || !data?.success) {
            navigate("/login", { replace: true });
        }
    }, [data, isError, isPending, navigate]);

    if (isPending) return <FullPageAuthSkeleton />;

    return <Outlet />;
};

export default Authentication;