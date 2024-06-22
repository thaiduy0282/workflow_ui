export const ContainerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="layout__container">
      <div className="layout__container-parent">
        <div className="layout__container-child">{children}</div>
      </div>
    </div>
  );
};
