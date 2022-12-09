interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
