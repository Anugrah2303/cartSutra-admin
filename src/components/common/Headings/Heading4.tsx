import type { HeadingProps } from "../../../interface/common";

const Heading4 = ({ title, subtitle, center = false, className = "" }: HeadingProps) => {
    return (
        <div className={`${center ? "text-center" : ""}`}>
            <h4 className={`relative inline-block text-sm md:text-base font-semibold text-(--text-primary) ${className}`}>
                <span className="absolute inset-0 bg-(--color-primary) opacity-10 blur-md scale-110 rounded-md "></span>
                <span className="relative z-10">
                    {title}
                </span>
            </h4>

            <div className={`mt-1 h-0.5 w-10 rounded-full bg-(--color-primary) opacity-60 ${center ? "mx-auto" : ""}  `}></div>
            {subtitle && (<p className={`mt-2 text-xs md:text-sm text-(--text-secondary) leading-relaxed max-w-sm ${center ? "mx-auto" : ""} `}>
                {subtitle}
            </p>)}
        </div>
    );
};

export default Heading4;