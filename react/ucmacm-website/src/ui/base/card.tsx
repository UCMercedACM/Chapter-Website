interface CardProps {
  description: string;
  logo: string;
}

const Card = ({ description, logo }: CardProps) => {
  return (
    // <div className="container 2xl bg-slate-100 rounded-xl">
    //   <p>hello world</p>
    // </div>
    <div className="drop-shadow-md">
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ">
        {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5> */}
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <img src={logo} />
      </div>
    </div>
  );
};

export default Card;
