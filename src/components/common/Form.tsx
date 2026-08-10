import type { formProps } from "../../interface/common"
import Heading1 from "./Headings/Heading1"

const Form = ({onSubmit, children, title}: formProps) => {
    return (
        <>
            <div className="min-h-screen w-full flex justify-center items-center">
                <div className="px-8 pt-10 m-1.5 pb-7 w-130 border-(--color-primary) border rounded-md shadow-(--shadow-primary-glow)">
                    <Heading1 title={title} />
                    <form onSubmit={onSubmit} className="flex justify-center items-center flex-col gap-4 mt-7">
                        {children}
                    </form>
                </div>
            </div>
        </>
    )
}

export default Form