const ManageHeader = () => {
  return (
    <div className={" border-b bg-card"}>
      <div
        className={
          "container flex flex-wrap items-center justify-between gap-6 py-8"
        }
      >
        <div>
          <p className={"text-3xl font-bold"}>Manage</p>
          <p className={"text-muted-foreground"}>
            Manage your account settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageHeader;
