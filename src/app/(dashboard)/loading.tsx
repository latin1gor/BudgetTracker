import Loader from "@/components/general/loader";

const Loading = () => {
  return (
    <div className={"flex flex-col items-center justify-center h-screen py-8"}>
      <Loader />
    </div>
  );
};

export default Loading;
