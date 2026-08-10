import type { headingProps } from "../../../interface/common";

const Heading3 = ({ title, subtitle, center = false }: headingProps) => {
    return (
        <div className={`${center ? "text-center" : ""}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--color-primary)/10 border border-(--color-primary)/20 `}>
                <span className="h-2 w-2 rounded-full bg-(--color-primary) animate-pulse "></span>
                <h3 className="text-lg md:text-xl font-semibold text-(--text-primary) ">
                    {title}
                </h3>
            </div>

            {subtitle && (<p className={`mt-2 text-sm text-(--text-secondary) max-w-md leading-relaxed ${center ? "mx-auto" : ""}`}>
                {subtitle}
            </p>
            )}
        </div>
    );
};

export default Heading3;