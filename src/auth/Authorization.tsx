import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useGetUser } from "../hooks/queries/auth.queries";
import type { UserIF } from "../interface/data/user";
import { UserRole } from "../enums/user.enum";
import FullPageAuthSkeleton from "../components/common/skeletons/FullPageAuthSkeleton";

const Authorization = ({ authRole }: { authRole: UserRole }) => {

    const navigate = useNavigate();
    const { data, isError, isPending } = useGetUser<UserIF>();

    useEffect(() => {
        if (isPending) return;
        if (isError || !data?.success || !data.data) {
            navigate("/login", { replace: true });
            return;
        }

        const role = data.data.role;

        if (role !== authRole) {
            if (role === UserRole.ADMIN) navigate('/admin', { replace: true });
            else navigate('/', { replace: true });
        }
    }, [data, isPending, isError, navigate, authRole]);

    if (isPending) return <FullPageAuthSkeleton />

    return <Outlet />
}

export default Authorization