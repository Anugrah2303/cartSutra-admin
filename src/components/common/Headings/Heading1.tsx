
const Heading1 = ({ title}: {title: string}) => {
    return (
        <div>
            <h2 className="relative inline-block text-2xl md:text-3xl font-bold tracking-tight ">

                <span className="absolute inset-0 bg-[linear-gradient(135deg,#16A34A,#22C55E)] opacity-20 blur-md scale-110 "></span>

                <span className="relative z-10 bg-[linear-gradient(135deg,#16A34A,#22C55E)] bg-clip-text text-transparent ">
                    {title}
                </span>
            </h2>

            <div className={`mt-3 h-1 w-15 rounded-full bg-[linear-gradient(135deg,#16A34A,#22C55E)] transition-all duration-500 ease-out group-hover:w-16`}></div>

        </div>
    );
};

export default Heading1;