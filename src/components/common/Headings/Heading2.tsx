import type { headingProps } from "../../../interface/common";

const Heading2 = ({ title, subtitle, center = false }: headingProps) => {
    return (
        <div className={`${center ? "text-center" : ""}`}>
            
            <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
                <span className="h-6 w-1.5 rounded-full bg-(--color-primary) shadow-(--shadow-sm) "></span>

                <h2 className="text-xl md:text-2xl font-semibold text-(--text-primary) tracking-tight ">
                    {title}
                </h2>
            </div>

            {subtitle && (<p className={`mt-2 text-sm leading-relaxed text-(--text-secondary) max-w-md ${center ? "mx-auto" : "ml-1]"}`}>
                {subtitle}
            </p>)}

            <div className={`mt-3 h-1 w-12 bg-(--border-light) ${center ? "mx-auto" : "ml-1"}`}></div>
        </div>
    );
};

export default Heading2;