export const Loader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return <span className="loading loading-ring loading-lg m-auto block"></span>;
};
